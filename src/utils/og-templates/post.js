import satori from "satori";
import { SITE } from "@/config";
import loadOgFonts from "../loadOgFonts";
import { getFirstPostImageDataUri } from "../getFirstPostImage";

function buildDefaultTemplate(post) {
  return {
    type: "div",
    props: {
      style: {
        background: "#fefbfb",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Noto Sans SC",
      },
      children: [
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              top: "-1px",
              right: "-1px",
              border: "4px solid #000",
              background: "#ecebeb",
              opacity: "0.9",
              borderRadius: "4px",
              display: "flex",
              justifyContent: "center",
              margin: "2.5rem",
              width: "88%",
              height: "80%",
            },
          },
        },
        {
          type: "div",
          props: {
            style: {
              border: "4px solid #000",
              background: "#fefbfb",
              borderRadius: "4px",
              display: "flex",
              justifyContent: "center",
              margin: "2rem",
              width: "88%",
              height: "80%",
            },
            children: {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  margin: "20px",
                  width: "90%",
                  height: "90%",
                },
                children: [
                  {
                    type: "p",
                    props: {
                      style: {
                        fontSize: 72,
                        fontWeight: "bold",
                        maxHeight: "84%",
                        overflow: "hidden",
                      },
                      children: post.data.title,
                    },
                  },
                  {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        marginBottom: "8px",
                        fontSize: 28,
                      },
                      children: [
                        {
                          type: "span",
                          props: {
                            children: [
                              "by ",
                              {
                                type: "span",
                                props: {
                                  style: { color: "transparent" },
                                  children: '"',
                                },
                              },
                              {
                                type: "span",
                                props: {
                                  style: {
                                    overflow: "hidden",
                                    fontWeight: "bold",
                                  },
                                  children: post.data.author,
                                },
                              },
                            ],
                          },
                        },
                        {
                          type: "span",
                          props: {
                            style: { overflow: "hidden", fontWeight: "bold" },
                            children: SITE.title,
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      ],
    },
  };
}

function buildImageTemplate(post, backgroundImage) {
  return {
    type: "div",
    props: {
      style: {
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        fontFamily: "Noto Sans SC",
        color: "#ffffff",
      },
      children: [
        {
          type: "img",
          props: {
            src: backgroundImage,
            style: {
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            },
          },
        },
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.45)",
            },
          },
        },
        {
          type: "div",
          props: {
            style: {
              position: "relative",
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: "100%",
              height: "100%",
              padding: "64px",
            },
            children: [
              {
                type: "p",
                props: {
                  style: {
                    fontSize: 72,
                    fontWeight: "bold",
                    lineHeight: 1.2,
                    maxHeight: "75%",
                    overflow: "hidden",
                    color: "#ffffff",
                  },
                  children: post.data.title,
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    fontSize: 28,
                    color: "#ffffff",
                  },
                  children: [
                    {
                      type: "span",
                      props: {
                        children: [
                          "by ",
                          {
                            type: "span",
                            props: {
                              style: { color: "transparent" },
                              children: '"',
                            },
                          },
                          {
                            type: "span",
                            props: {
                              style: {
                                overflow: "hidden",
                                fontWeight: "bold",
                                color: "#ffffff",
                              },
                              children: post.data.author,
                            },
                          },
                        ],
                      },
                    },
                    {
                      type: "span",
                      props: {
                        style: {
                          overflow: "hidden",
                          fontWeight: "bold",
                          color: "#ffffff",
                        },
                        children: SITE.title,
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  };
}

export default async post => {
  const backgroundImage = await getFirstPostImageDataUri(post);
  const markup = backgroundImage
    ? buildImageTemplate(post, backgroundImage)
    : buildDefaultTemplate(post);

  return satori(markup, {
    width: 1200,
    height: 630,
    embedFont: true,
    fonts: await loadOgFonts(
      post.data.title + post.data.author + SITE.title + "by"
    ),
  });
};
