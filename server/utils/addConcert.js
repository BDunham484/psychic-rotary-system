const { Concert } = require('../models');

module.exports = {
    addConcert: async ({ ...data }) => {
        await Concert.findOne({ 'customId': data.customId }, async (err, custom) => {
            if (err) return handleError(err);

            if (custom) {
                const savedConcertId = {
                    _id: custom._id
                }
                const update = {
                    artists: data.artists,
                    venue: data.venue,
                    date: data.date,
                    dateTime: data.dateTime,
                    address: data.address,
                    website: data.website,
                    email: data.email,
                    ticketLink: data.ticketLink,
                }
                const updatedConcert = await Concert.findByIdAndUpdate(
                    savedConcertId,
                    update,
                    { new: true }
                )
                console.log('UPDATEDCONCERT');
                // console.log(updatedConcert);
                return updatedConcert;
            } else {
                const concert = await Concert.create({ ...data })
                // .select(-__v);
                console.log('SAVEDCONCERT');
                // console.log(concert);
                return concert;
            }
        })
    },
}