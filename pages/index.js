import Head from 'next/head'
import Link from 'next/link'

const MEME_IMG_WIDTH = 125;
const CONTENT_WIDTH = {
  width: "1080px",
  maxWidth: "90%"
}

const Home = () => {
  return (
    <div className="bg-color-background flex flex-column justify-center align-center fullpage">
      <Head>
        <title>Consulting Survey</title>
        <meta name="description" content="Find out your chances of fulfilling your McKinsey dreams, and if you’re destined to improve the world one powerpoint at a time!" />
      </Head>

      <div style={CONTENT_WIDTH}>
        <div className="flex flex-row justify-between align-center marginbottom-32">
          <img src="https://washingtonmonthly.com/wp-content/uploads/2019/02/45577905355_0a4c9d5ee0_k.jpg" width={MEME_IMG_WIDTH} />
          <img src="https://indypendent.org/wp-content/uploads/2018/10/34687520732_de41c65f2f_k-450x252.jpg" width={MEME_IMG_WIDTH} />
          <img src="https://www.aclu.org/sites/default/files/styles/blog_main_wide_580x384/public/field_image/web19-paulmanafort-1160x768.jpg?itok=H2iV7gH6" width={MEME_IMG_WIDTH} />
          <img src="https://external-preview.redd.it/TkNwJ5_yMTDpm81QvDAdJB9maE8t65TDazkMtnM4xNc.jpg?auto=webp&s=daa08ba1b3495c212b09748fe56cea16de44df59" width={MEME_IMG_WIDTH} />
          <img src="https://i.insider.com/5b8825a33cccd123008b4589?width=700" width={MEME_IMG_WIDTH} />
        </div>

        <div className="flex flex-row justify-between align-center">
          <img className="marginright-32" style={{maxWidth: "50%"}} src="https://media1.tenor.com/images/b370b3385395fa3cd0838cef0aa74f46/tenor.gif?itemid=4457028" />

          <div className="marginleft-32">
            <p className="font-main h1 primary-accent font-italic fw-black marginbottom-24">Are you meant to be a consultant?</p>
            <p className="font-main h3 primary-accent fw-regular opacity-7 marginbottom-32">Find out your chances of fulfilling your McKinsey dreams, and if you’re destined to improve the world one powerpoint at a time!</p>

            <Link href='/survey'>
              <div className="padding-16 secondary-accent-background br-reg flex justify-center btn">
                <p className="font-main h3 white-color fw-medium">Take the 2 min survey -&gt;</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div style={{position: "fixed", bottom: "20px", ...CONTENT_WIDTH}}>
        <p className="font-main text-color opacity-7">*We are not responsible for any misguided career decisions and/or eventual depression</p>
      </div>
    </div>
  )
}

export default Home;