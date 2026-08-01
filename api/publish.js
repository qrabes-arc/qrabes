export default async function handler(req, res) {

    // Only POST
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Only POST allowed"
        });
    }

    try {

        // Data from frontend
        const {
            title,
            description,
            image,
            category,
            author,
            tags,
            featured,
            trending,
            status
        } = req.body;

        // Validation
        if (!title || !description || !image) {
            return res.status(400).json({
                error: "Title, Description and Image are required."
            });
        }

        const token = process.env.GITHUB_TOKEN;

        if (!token) {
            return res.status(500).json({
                error: "GitHub Token Missing"
            });
        }

        const owner = "qrabes-arc";
        const repo = "qrabes";
        const path = "public/user_posts.json";

        // Read existing JSON from GitHub

        const fileResponse = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/vnd.github+json"
                }
            }
        );

        if (!fileResponse.ok) {

            const err = await fileResponse.text();

            return res.status(500).json({
                error: err
            });

        }

        const fileData = await fileResponse.json();

        const content = Buffer.from(
            fileData.content,
            "base64"
        ).toString("utf8");

        let posts = [];

        try {

            posts = JSON.parse(content);

        } catch {

            posts = [];

        }
              // New Post
        posts.unshift({

            id: Date.now(),

            title,
            description,
            image,

            category: category || "",

            author: author || "QRABES",

            tags: tags || [],

            featured: featured || false,

            trending: trending || false,

            status: status || "publish",

            likes: 0,
            comments: 0,
            shares: 0,
            views: 0,

            published_at: new Date().toISOString()

        });

        // Upload updated JSON to GitHub

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

                    message: `Publish: ${title}`,

                    content: Buffer
                        .from(
                            JSON.stringify(posts, null, 2)
                        )
                        .toString("base64"),

                    sha: fileData.sha

                })

            }
        );

        const result = await updateResponse.json();

        if (!updateResponse.ok) {

            return res.status(500).json({
                error: result
            });

        }

        return res.status(200).json({

            success: true,

            message: "Post Published Successfully",

            post: posts[0]

        });

    } catch (error) {

        return res.status(500).json({

            error: error.message

        });

    }

}
