import { PageOptions } from "@graphcommerce/framer-next-pages"
import { LayoutDocument, LayoutNavigation, LayoutNavigationProps } from "../../components"
import { GetStaticProps, PageMeta } from "@graphcommerce/next-ui"
import { InnerTop } from "../../components/shared/Inner/Innertop"
import { graphqlSharedClient, graphqlSsrClient } from "../../lib/graphql/graphqlSsrClient"
import { StoreConfigDocument } from "@graphcommerce/magento-store"
import { cacheFirst } from "@graphcommerce/graphql"
import { MpBlogPostsDocument, MpBlogPostsQuery } from "../../graphql/BlogsByCatergoryId.gql"
import { Box, Typography } from "@mui/material"
import { saxoGrammaticus } from "../../lib/fonts"
import { BlogsGrid } from "../../components/Blogs/BlogsGrid"

type GetPageStaticProps = GetStaticProps<LayoutNavigationProps>

type BlogsPropsType = {
    blogLists?: MpBlogPostsQuery
}

function Blogs(props: BlogsPropsType) {
    return (
        <>
            <PageMeta
                title='Blogs | Ribbon and Balloons'
                metaDescription='Custom cakes, handcrafted desserts — made for your moment.'
                canonical='/blogs'
            />

            <InnerTop title={'Blogs'} isFilter={false} />

            <Box
                sx={{
                    paddingInline: {
                        xs: '18px',
                        md: '25px',
                        lg: '55px',
                    },
                    marginBottom: { xs: '35px', md: '45px' },
                }}
            >
                <Box>
                    <Typography
                        variant='h1'
                        sx={{
                            fontFamily: `${saxoGrammaticus.style.fontFamily}, sans-serif`,
                            color: (theme: any) => theme.palette.custom.heading,
                        }}
                    >
                        Blogs
                    </Typography>
                </Box>

                <BlogsGrid blogLists={props?.blogLists} />
            </Box>
        </>
    )
}

Blogs.pageOptions = {
    Layout: LayoutNavigation,
} as PageOptions

export default Blogs

export const getStaticProps: GetPageStaticProps = async (context) => {
    const { params, locale } = context
    const client = graphqlSharedClient(context)
    const conf = client.query({ query: StoreConfigDocument })

    const staticClient = graphqlSsrClient(context)

    const layout = staticClient.query({
        query: LayoutDocument,
        fetchPolicy: cacheFirst(staticClient),
    })

    const BlogsQueries = staticClient.query({
        query: MpBlogPostsDocument,
        variables: {
            action: 'get_post_by_categoryId',
            categoryId: 18,
            pageSize: 50,
            currentPage: 1,
        },
    })

    const blogLists = (await BlogsQueries)?.data

    return {
        props: {
            ...(await layout).data,
            blogLists,
            apolloState: await conf.then(() => client.cache.extract()),
        },
        revalidate: 60 * 20,
    }
}