const mongoose = require("mongoose");
const Campground = require("../model/items.js");
const { descriptors, places } = require("./seedHelpers");
const arra = require("./cities");
const User = require("../model/user");
const mbxgeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const geocoder = mbxgeocoding({
  accessToken:
    "pk.eyJ1IjoiY3ByYWthc2gxIiwiYSI6ImNsZzZpNXBpMjBkZzkzaHFyMm83OGQyN3YifQ.5BnzbS1hsEGKg95hwpbQ7Q",
});

mongoose.connect("mongodb://127.0.0.1:27017/Unusable2Usable", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on(
  "error",
  console.error.bind(console, "ConnectionRefused")
);
mongoose.connection.once("open", () => {
  console.log("Connected");
});
const sample = (array) => array[Math.floor(Math.random() * array.length)];
const createCampground = async () => {
  await Campground.deleteMany({});
  const user = await User.findById("648b18c8e8f5105593c4c563");
  console.log(user);
  for (let i = 0; i < 10; i++) {
    const camp = new Campground({
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${arra[Math.floor(Math.random() * 1000)].city} ${
        arra[Math.floor(Math.random() * 1000)].state
      }`,
      description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Totam, modi natus. Nobis eum, provident illo quaerat deleniti culpa consequuntur dolor ratione consectetur ea quis. Velit corrupti esse sit atque ratione?Consectetur neque recusandae, praesentium distinctio sed placeat odio et repudiandae vitae repellat sint officia magni at, a fuga ex, est quas! Saepe, quos nemo. Amet autem saepe animi quibusdam nostrum.Dolor voluptatem ipsam molestias quia earum, amet culpa. Fugit molestiae consectetur optio eligendi perspiciatis. Repudiandae soluta ea odio dignissimos mollitia esse sequi molestiae unde tenetur, explicabo rerum autem laboriosam ab?",
      price: Math.floor(Math.random() * 1000),
    });
    //  const camp=new Campground({title:'HOLLO'})
    const geoData = await geocoder
      .forwardGeocode({
        query: camp.location,
        limit: 1,
      })
      .send();
    camp.geometry = geoData.body.features[0].geometry;
    camp.author = user;
    await camp.save();
    // console.log(camp);
  }
};
createCampground();
createCampground().then(() => {
  mongoose.connection.close();
});
