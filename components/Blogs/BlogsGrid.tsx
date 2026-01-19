import { Box } from "@mui/material";
import { MpBlogPostsQuery } from "../../graphql/BlogsByCatergoryId.gql";
import { BlogsCard } from "./BlogsCard";

type BlogsGridPropsType = {
    blogLists?: MpBlogPostsQuery
}

export function BlogsGrid(props: BlogsGridPropsType) {
    const blogItems = props?.blogLists?.mpBlogPosts?.items;

    return (
        <Box sx={(theme) => ({
            marginTop: { xs: "29px", md: "58px" },
            display: "grid",
            gridTemplateColumns: { xs: "repeat(1, 1fr)", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" },
            columnGap: { xs: "16px", md: "28px" },
            rowGap: { xs: "40px", md: "56px" },
        })}>
            {
                blogItems?.map((value, index) => (
                    <BlogsCard blog={value} key={index} />
                ))
            }
        </Box>
    )
}