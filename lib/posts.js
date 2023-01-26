import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import {remark} from "remark";
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts');

export function getSortedPostsData() {
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames.map((fileName) => {
        const id = fileName.replace(/\.md$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);
        return { id, ...matterResult.data };
    });
    return allPostsData.sort((a, b) => b.date - a.date);
}

export const getAllPostIds = () =>
    fs.readdirSync(postsDirectory).map((fileName) => ({
        params: { id: fileName.replace(/\.md$/, '') },
    }));

export const getPostData = async (id) => {
    const matterResult = matter(
        fs.readFileSync(path.join(postsDirectory, `${id}.md`), 'utf-8')
    );
    const contentHtml = (
        await remark().use(html).process(matterResult.content)
    ).toString();

    return {
        id,
        contentHtml,
        ...matterResult.data,
    };
};
