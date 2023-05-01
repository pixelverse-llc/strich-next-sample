import Head from 'next/head'
import Link from "next/link";

import styles from '../styles/index.module.css';

export default function Home() {
  return (
    <>
      <Head>
        <title>STRICH Next.js example</title>
        <meta name="description" content="Sample code illustrating how to integrate STRICH SDK into a Next.js application." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <header>
          <h1>STRICH Next.js sample</h1>
        </header>

        <section className={styles.section}>
            <p>
                <Link href={"scanner"}>Scan codes</Link> (modern; functional component)
            </p>
        </section>
      </main>
    </>
  )
}
