import { PageOptions } from '@graphcommerce/framer-next-pages'
import { cacheFirst } from '@graphcommerce/graphql'
import { getCategoryStaticPaths } from '@graphcommerce/magento-category'
import { StoreConfigDocument } from '@graphcommerce/magento-store'
import { GetStaticProps, PageMeta } from '@graphcommerce/next-ui'
import { GetStaticPaths } from 'next'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { LayoutDocument, LayoutNavigation, LayoutNavigationProps } from '../../components'
import { InnerTop } from '../../components/shared/Inner/Innertop'
import { GetPostByNameDocument, GetPostByNameQuery } from '../../graphql/GetCourseByName.gql'
import { graphqlSharedClient, graphqlSsrClient } from '../../lib/graphql/graphqlSsrClient'
import { Box, Typography } from '@mui/material'
import { saxoGrammaticus } from '../../lib/fonts'
import { BlogDetails } from '../../components/Blogs/BlogDetails'
import { MpBlogPostsDocument, MpBlogPostsQuery } from '../../graphql/BlogsByCatergoryId.gql'
import { BlogsGrid } from '../../components/Blogs/BlogsGrid'
import { BlogsCard } from '../../components/Blogs/BlogsCard'

export type RouteProps = { url: string[] }
type GetPageStaticPaths = GetStaticPaths<RouteProps>
type GetPageStaticProps = GetStaticProps<LayoutNavigationProps>

type BlogPostPageProps = { blogPostData?: GetPostByNameQuery, blogLists?: MpBlogPostsQuery }

function BlogPostPage(props: BlogPostPageProps) {
    const blogItems = props?.blogLists?.mpBlogPosts?.items;
    const blogPostData = props?.blogPostData?.mpBlogPosts?.items
    const router = useRouter()
    const url = router?.query?.url
    const slug = Array.isArray(url) ? url[0] : null

    const blogDetails = useMemo(() => {
        if (!slug || !Array.isArray(blogPostData)) return null

        return blogPostData.find((blog) => blog?.url_key?.toLowerCase() === slug.toLowerCase())
    }, [slug, blogPostData])

    if (!blogDetails || !blogDetails?.post_content) {
        return null;
    }

    const relatedblogs = () => {
        if (!Array.isArray(blogItems)) return [];

        return [...blogItems].sort(() => 0.5 - Math.random()).slice(0, 4);
    }

    return (
        <>
            <PageMeta
                title={`${blogDetails?.name} | Ribbon and Balloons'`}
                metaDescription='Custom cakes, handcrafted desserts — made for your moment.'
                canonical={`/blogs/${blogDetails?.url_key}`}
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
                        {blogDetails?.name}
                    </Typography>
                </Box>

                <BlogDetails blogs={blogDetails} />

                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: { xs: "24px", md: "42px" },
                    alignItems: "start",
                    justifyContent: "start"
                }}>
                    <Typography variant='h1' sx={{
                        fontFamily: `${saxoGrammaticus.style.fontFamily}, sans-serif`,
                        color: (theme: any) => theme.palette.custom.heading,
                    }}>Related blogs</Typography>

                    <Box sx={(theme) => ({
                        display: "grid",
                        gridTemplateColumns: { xs: "repeat(1, 1fr)", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
                        columnGap: { xs: "16px", md: "28px" },
                        rowGap: { xs: "40px", md: "56px" },
                    })}>
                        {
                            relatedblogs()?.map((value, index) => (
                                <BlogsCard blog={value} key={index} />
                            ))
                        }
                    </Box>
                </Box>
            </Box>
        </>
    )
}

BlogPostPage.pageOptions = {
    Layout: LayoutNavigation,
} as PageOptions

export default BlogPostPage

// eslint-disable-next-line @typescript-eslint/require-await

export const getStaticPaths: GetPageStaticPaths = async ({ locales = [] }) => {
    // Disable getStaticPaths while in development mode
    if (process.env.NODE_ENV === 'development') return { paths: [], fallback: 'blocking' }

    const path = (locale: string) => getCategoryStaticPaths(graphqlSsrClient({ locale }), locale)
    const paths = (await Promise.all(locales.map(path))).flat(1)
    return { paths, fallback: 'blocking' }
}
export const getStaticProps: GetPageStaticProps = async (context) => {
    const { params, locale } = context

    const client = graphqlSharedClient(context)
    const conf = client.query({ query: StoreConfigDocument })

    const staticClient = graphqlSsrClient(context)
    const pageurl = params?.url

    if (!pageurl?.[0]) return { notFound: true }

    const layout = staticClient.query({
        query: LayoutDocument,
        fetchPolicy: cacheFirst(staticClient),
    })

    const blogPostQuery = staticClient.query({
        query: GetPostByNameDocument,
        variables: {
            url_key: pageurl?.[0],
        },
    })
    const blogPostData = (await blogPostQuery)?.data

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
            blogPostData,
            apolloState: await conf.then(() => client.cache.extract()),
        },
        revalidate: 60 * 20,
    }
}