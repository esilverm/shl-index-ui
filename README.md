# SHL Index

## Getting Started

### Installation

1. On linux, run to install npm

```bash
sudo apt install npm
```

**Note: There may be other dependancies that need installed with nmp**

2. Clone the repository to your local environment

```bash
git clone https://github.com/esilverm/shl-index-ui
```

**Note: when making changes, it is best to fork the repository and submit pull requests**

3. Navigate to the directory

```bash
cd shl-index-ui
```

4. Install all libraries

```bash
npm install
```

5. Get the .env.local file from one of the head developers and place it in the top level directory.

### Run The Developer Server

1. SSH tunnel into the production server to get access to the database

```bash
# run the ssh tunnel in a detached process
ssh -N -L 3306:127.0.0.1:3306 <username>@<server> -p <port> &
```

2. Run the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000) with your browser to see the result.

**Note: Only the localhost ip address will work for the development server. (http://127.0.0.1:3000)**

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/import?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
