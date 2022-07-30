import dotenv from 'dotenv'
import puppeteer from 'puppeteer'

main()

async function main() {
  await bootstrap()
  await start({
    username: process.env.USERNAME!,
    password: process.env.PASSWORD!,
  })
}

async function bootstrap() {
  dotenv.config()
}

const BASE_URL = 'https://scbcoop.scb.co.th'
const URLS = {
  login: `${BASE_URL}/Account/Login.aspx`,
  depositAccount: `${BASE_URL}/Deposit/DepositAccount.aspx`,
  shareStock: `${BASE_URL}/Share/ShareStock.aspx`,
}

async function start({
  username,
  password,
}: {
  username: string
  password: string
}) {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1280, height: 720 },
  })
  const page = await browser.newPage()

  const inputUsernameElmId = '#bodyContent_txtLogin'
  const inputPasswordElmId = '#bodyContent_txtPWD'
  const btnLoginElmId = '#bodyContent_btnSubmit'
  await page.goto(URLS.login, { waitUntil: 'domcontentloaded' })
  await page.type(inputUsernameElmId, username)
  await page.keyboard.press('Tab')
  await page.waitForNavigation()
  await page.type(inputPasswordElmId, password)
  await page.click(btnLoginElmId)
  await page.waitForNavigation()

  // share stock page
  const labelShareStockElmId = '#ContentPlaceHolder1_bodyContent_lblShareStock'
  await page.goto(URLS.shareStock, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector(labelShareStockElmId)
  /*
  const textContent = await page.evaluate(() => {
    // need to pass explicitly to avoid reference error
    const labelShareStockElmId =
      '#ContentPlaceHolder1_bodyContent_lblShareStock'
    return document.querySelector(labelShareStockElmId)?.textContent
  })
  */
  await page.screenshot({ path: 'share-stocks.png' })

  await browser.close()
}
