import { Image } from "@graphcommerce/image";
import { Box } from "@mui/material";
import { splitHtmlAfterPCount } from "../../lib/splitHtmlAfterPCount";

export function BlogDetails(props: any) {
    const blogs = props?.blogs;

    const { first, second } = splitHtmlAfterPCount(
        blogs?.post_content,
        5
    );

    return (
        <Box sx={{
            marginTop: { xs: "24px", md: "34px" },
        }}>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                gap: { xs: "24px", md: "56px" },
                alignItems: "start",
                justifyItems: "start",
                width: "100%"
            }}>
                <Box sx={{ width: "100%" }}>
                    <Image
                        src={blogs?.image || "https://srv900162.hstgr.cloud/media/mageplaza/blog/post/p/l/placeholder.jpg"}
                        alt={blogs?.name || ""}
                        width={200}
                        height={380}
                        sx={{ height: 'auto', maxHeight: { xs: "unset", md: "400px", lg: "533px" }, minHeight: { xs: "unset", md: "400px", lg: "533px" }, width: '100%', objectFit: 'cover', borderRadius: "8px" }}
                    />
                </Box>

                <Box sx={{
                    ['&.MuiBox-root p, &.MuiBox-root div *']: {
                        margin: { xs: "0 0 20px !important", sm: "0 0 33px !important" },
                        fontSize: "16px",
                        lineHeight: "170%",
                        color: "#6F6F6F",
                        fontWeight: 400
                    },
                    ['&.MuiBox-root div ul li, &.MuiBox-root div ol li']: {
                        margin: "0 0 8px !important",
                    },
                    ['&.MuiBox-root div strong']: {
                        fontWeight: 700
                    }
                }}>
                    <Image
                        src={blogs?.gallery_images?.length > 0 ? `https://srv900162.hstgr.cloud/media/${blogs?.gallery_images[0]}` : blogs?.image || "https://srv900162.hstgr.cloud/media/mageplaza/blog/post/p/l/placeholder.jpg"}
                        alt={blogs?.name || ""}
                        width={200}
                        height={380}
                        sx={{ height: 'auto', maxHeight: { md: "250px", lg: "336px" }, minHeight: { md: "250px", lg: "336px" }, width: '100%', maxWidth: { sm: "50%", md: "440px" }, objectFit: 'cover', borderRadius: "8px", float: { xs: "left", md: "left" }, margin: "0px 26px 20px 0px" }}
                    />

                    {blogs?.post_content && (
                        <div dangerouslySetInnerHTML={{ __html: first }} />
                    )}

                    <Image
                        src={blogs?.gallery_images?.length > 1 ? `https://srv900162.hstgr.cloud/media/${blogs?.gallery_images[1]}` : blogs?.image || "https://srv900162.hstgr.cloud/media/mageplaza/blog/post/p/l/placeholder.jpg"}
                        alt={blogs?.name || ""}
                        width={200}
                        height={380}
                        sx={{ height: 'auto', maxHeight: { md: "400px", lg: "533px" }, minHeight: { md: "400px", lg: "533px" }, width: '100%', maxWidth: { sm: "50%", md: "440px" }, objectFit: 'cover', borderRadius: "8px", float: "right", margin: "20px 0px 20px 41px" }}
                    />

                    {blogs?.post_content && (
                        <div dangerouslySetInnerHTML={{ __html: second }} />
                    )}
                </Box>
            </Box>
        </Box>
    )
}