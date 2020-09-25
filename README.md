# SHL Index

## What is this?

This is a project to build a full scale sports statistical index in Typescript, Javascript, and Nextjs with a backend written in Typescript and Node. A few things I'm striving to do in this project are:

1. _Maintain a consistent and scalable codebase._ I want to be able to build upon this and allow others to do so as well. Using typescript I can enforce type safety and force myself to be extra careful whenever I modify props for a component/page. I also am making use of eslint, prettier, husky, and lint-staged to enforce a consistent code style.

2. _Obtain max scores on lighthouse reports._ I only want to see 99s and 100s for this site. Jokes aside, good performance, accessibility, and seo are important when building any site. There is no reason a user should have to put up with slow loading times, costly network requests, or concerns with accessibility. The site should feel familiar and very usable for anybody.

3. _Usable mobile and desktop versions of the site._ One of the main problems for similar sites to that which I am trying to create is a lack of mobile responsiveness. Users tend to have to zoom in to tap links, scroll endlessly to see stats, etc. That sucks. I don't want that.

4. _Did I mention SPEED?_ I am making use of image optimization plugins as well as NextJS's static site generation capabilities whenever I can for maximum speed. Users shouldn't have to wait for data.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/import?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
