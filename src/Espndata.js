

const puppeteer = require('puppeteer');
// const { GrDatabase } = require('react-icons/gr');

(async () => {
    const browser = await puppeteer.launch({ headless : false });

    const page = await browser.newPage();
        await page.goto('https://sports.daum.net/schedule/worldcup' );
        await page.setViewport({
            width: 1920,
            height: 1080
        });
    // await page.waitFor(1000);
    // await browser.close();

    let data = {};
    let temp = await page.$(
    "#hermesData");
    data.name = await page.evaluate((data) => {
        return data.textContent;
    }, temp);
    data.link = await page.evaluate((data) => {
        return data.href;
    }, temp);

    data.game_date = await page.$eval("#scheduleList > tr:nth-child(1) > td.td_date", (data) => data.textContent); //날짜
    data.game_time = await page.$eval("#scheduleList > tr:nth-child(1) > td.td_time", (data) => data.textContent); //시간
    data.home_team = await page.$eval("#scheduleList > tr:nth-child(1) > td.td_team > div.info_team.team_home > span.link_team > span",
    (data) => data.textContent); //홈팀
    data.away_team = await page.$eval("#scheduleList > tr:nth-child(1) > td.td_team > div.info_team.team_away > span.link_team > span",
    (data) => data.textContent); //어웨이팀
    data.home_score = await page.$eval("#scheduleList > tr:nth-child(1) > td.td_team > div.info_team.team_home > em",
    (data) => data.textContent); //홈 스코어
    data.away_score = await page.$eval("#scheduleList > tr:nth-child(1) > td.td_team > div.info_team.team_away > em",
    (data) => data.textContent); //어웨이 스코어
    data.game_group = await page.$eval("#scheduleList > tr:nth-child(1) > td.td_tv", (data) => data.textContent); // 조편성
    
    
    console.log(data.game_date);
    console.log(data.game_time);
    console.log(data.home_team);
    console.log(data.away_team);
    console.log(data.home_score);
    console.log(data.away_score);
    console.log(data.game_group);
    
    
    
    
    })();
    // return (
    //   (data.game_date)
    //   (data.game_time)
    // )



// export default Espndata;




