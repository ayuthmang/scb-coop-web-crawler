import dotenv from 'dotenv'
import path from 'path'
import puppeteer, { Puppeteer } from 'puppeteer'

main()

async function main() {
  await bootstrap()
  await start()
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

async function start() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1280, height: 720 },
  })
  const page = await browser.newPage()

  await login(page, {
    username: process.env.USERNAME!,
    password: process.env.PASSWORD!,
  })

  await gotoDepositAccountPage(page)
  await page.screenshot({ path: 'deposit-account.png' })

  await gotoShareStockPage(page)
  await page.screenshot({ path: 'share-stocks.png' })

  await browser.close()
}

async function login(
  page: puppeteer.Page,
  {
    username,
    password,
  }: {
    username: string
    password: string
  }
) {
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
}

async function gotoShareStockPage(page: puppeteer.Page) {
  const labelShareStockElmId = '#ContentPlaceHolder1_bodyContent_lblShareStock'
  await page.goto(URLS.shareStock, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector(labelShareStockElmId)
  /*
  const textContent = await page.evaluate(() => {
    // need to pass explicitly to avoid reference error
    const labelShareStockElmIgd =
      '#ContentPlaceHolder1_bodyContent_lblShareStock'
    return document.querySelector(labelShareStockElmId)?.textContent
  })
  */
}

async function gotoDepositAccountPage(page: puppeteer.Page) {
  const tableBodyElmId = '#ContentPlaceHolder1_bodyContent_GridView1'
  await page.goto(URLS.depositAccount, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector(tableBodyElmId)
}
