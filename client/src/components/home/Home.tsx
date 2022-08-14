import React from "react";
import "../../styles/scss/pagesComponents/home/home.scss"
import "../../styles/scss/pagesComponents/home/576.scss"
import "../../styles/scss/pagesComponents/home/768.scss"


import HomeGradient from "../../modules/HomeGradient";
import HomeSlider from "../../modules/HomeSlider";
import CardLink from "./elements/CardLink";

const Home = () => {
  return <div className="home">
    <div className="slider">
      <HomeSlider/>
      <div className="link-card-container">
        <CardLink href="/events" title="Events" text="Search for events" imgLink="/cardImg/friends.jpg"/>
        <CardLink href="/events" title="My events" text="Get information about created and joined events" imgLink="/cardImg/meal.jpg"/>
        <CardLink href="/chats" title="Chats" text="Check your chats" imgLink="/cardImg/chat.jpg"/>
        <CardLink href="/user" title="User Panel" text="Personalize your account" imgLink="/cardImg/male.jpg"/>
        <CardLink href="/add/event" title="Add Event" text="Create your own event" imgLink="/cardImg/wine-glass.jpg"/>
        <CardLink href="/add/place" title="Add Place" text="Add your favourite place and help us in developing the app" imgLink="/cardImg/waterfall.jpg"/>

      </div>
    </div>

  </div>;
};

export default Home;
