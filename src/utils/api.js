const fs = require('fs');
const axios = require("axios").default;

let newsID
let idsArray = []
let relevantNews = []


const relevantTopics = ["privacy", "hack", "linux", "golang", "hacker", "the", "malware", "exploit",
"leak", "CIA", "NSA", "hacked", "breaches", "breached", "security", "OSINT", "leaked", "GNUl", "free and open source","open source"]
const newStoriesIDs = "https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty"
const newsInfos = "https://hacker-news.firebaseio.com/v0/item/"+newsID+".json?print=pretty"

const getLatestNewsIds = async () =>{
    try {
        const response = await axios.get(
            newStoriesIDs
        );
        for (let i = 0; i < response.data.length; i++) {
            idsArray.push(response.data[i])
        }
        return idsArray
    } catch (error) {
        return error;
    }
};

const fetchNewsInfo = async () => {
    try {

        await getLatestNewsIds();
        //         for (let i = 0; i < idsArray.length; i++) {
        for (let i = 0; i < 10; i++) {
            newsID = idsArray[i]
            const response = await axios.get(
                "https://hacker-news.firebaseio.com/v0/item/"+newsID+".json?print=pretty"
            );
            for (let j = 0; j < relevantTopics.length; j++) {
                if (response.data.title.toLowerCase().includes(relevantTopics[j])) {
                    relevantNews.push(response.data)
                }
            }
        }

        //create a file with the news if it doesn't exist
        if (!fs.existsSync('./news.json')) {
            fs.writeFileSync('./news.json', JSON.stringify(relevantNews))
        }

        //check if the news is already in the file, if it is, don't add it, if it is not, save the news and send it to the user

        let news = JSON.parse(fs.readFileSync('./news.json'))
        let newsToSend = []
        
        for (let i = 0; i < relevantNews.length; i++) {
            let found = false
            for (let j = 0; j < news.length; j++) {
                if (relevantNews[i].id === news[j].id) {
                    found = true
                }
            }
            if (!found) {
                newsToSend.push(relevantNews[i])
            }
        }
        fs.writeFileSync('./news.json', JSON.stringify(relevantNews))
        return newsToSend
            
    } catch (error) {
        console.log(error);
        return "Sorry, got an error";
    }
};

module.exports = {
    fetchNewsInfo,
    getLatestNewsIds
};

