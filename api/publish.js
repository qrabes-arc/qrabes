export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Only POST allowed"
    });
  }

  try {

    const { image, caption, username } = req.body;

    if (!image || !caption) {
      return res.status(400).json({
        error: "Image and caption required"
      });
    }

    const token = process.env.GITHUB_TOKEN;

    const owner = "qrabes-arc";
    const repo = "qrabes";
    const path = "public/user_posts.json";

    // GitHub se current JSON lena
    const fileResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json"
        }
      }
    );

    const fileData = await fileResponse.json();

    const content = Buffer.from(
      fileData.content,
      "base64"
    ).toString("utf-8");

    const posts = JSON.parse(content);

    // Naya post add
    posts.push({
      id: Date.now(),
      image,
      caption,
      username: username || "anonymous",
      created_at: new Date().toISOString()
    });


    // GitHub me update
    const updateResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: "Add new user post",
          content: Buffer.from(
            JSON.stringify(posts, null, 2)
          ).toString("base64"),
          sha: fileData.sha
        })
      }
    );


    const result = await updateResponse.json();

    return res.status(200).json({
      success: true,
      result
    });


  } catch (error) {

    return res.status(500).json({
      error: error.message
    });

  }

}
