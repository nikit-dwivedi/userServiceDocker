const { storyFormatter } = require("../formatter/auth.format");
const { responseFormater } = require("../formatter/response.format");
const { storyModel } = require("../models/story.model");

exports.addStory = async (userData, url) => {
    try {
        const storyCheck = await storyModel.findOne({ userId: userData.userId })
        if (storyCheck) {
            return responseFormater(false, "you can add one story max.")
        }
        const formattedData = storyFormatter(userData, url);
        const saveData = new storyModel(formattedData);
        await saveData.save();
        return responseFormater(true, "story added");
    } catch (error) {
        console.log(error);
        return responseFormater(false, error.message);
    }
}

exports.getVisibleStories = async () => {
    try {
        let [hour, minute] = new Intl.DateTimeFormat('en-GB', { timeStyle: 'short', timeZone: 'Asia/Kolkata' }).format(new Date()).split(":")
        let previousDate = getPreviousDay()
        let date = new Intl.DateTimeFormat(['ban', 'id']).format(new Date())
        hour = 0
        const storyData = await storyModel.aggregate([
            {
                $match: {
                    $or: [
                        {
                            $and:
                                [
                                    { hour: { $gt: hour } },
                                    { date: previousDate }
                                ]
                        },
                        {
                            date: date
                        }
                    ]
                }
            },
            {
                "$group": {
                    "_id": {
                        "id": "$userId",
                        "name": "$username",
                        "url": "$url"
                    }
                }
            },
            {
                "$group": {
                    "_id": {
                        "userId": "$_id.id",
                        "username": "$_id.name",
                    },
                    "url": {
                        "$push": "$_id.url",
                    },
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "userId": '$_id.userId',
                    "username": '$_id.username',
                    "url": "$url"
                }
            }
        ],
        )
        return storyData[0] ? responseFormater(true, "story list", storyData) : responseFormater(false, "no story found")
    } catch (error) {
        return responseFormater(false, error.message)
    }
}


function getPreviousDay() {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    let day = new Intl.DateTimeFormat(['ban', 'id']).format(date)
    return day
}