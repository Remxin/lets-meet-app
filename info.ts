/*
_-_-_-_-_-_-_-_- CHATS _-_-_-_-_-_-_-_-
    |
    |
    -- > My events chats (I am the owner of the event)
    |
    |
    -- > Favourite chats (Default section of favourite chats)
    |
    |
    -- > Other chats (all other chats)


______ LISTENERS ______
    --- Click ---

-- > (Resizable section icon) -> resizes scrollable chat sections
-- > (Plus sign) -> add new section of chats 
-- > (chat field) -> set this chat as main chat, remove current main chat, show chat messages on main field

    --- Drag ---

-- > (click and hold) -> can change chat section





_-_-_-_-_-_-_-_- INFORMATIONS -_-_-_-_-_-_-_-_-

NEW MODEL - user preferences
{
    language: "pl" || "en",    (now only introduced)
    chatSections: {             // when getting chats change to array and create sections throught map
        myChatEvents: [], // ? { id: String, chatsId: String[] }
        favourites: [], // ? { id: String, chatsId: String[] }
        otherChats: [] // ? { id: String, chatsId: String[] }
    },
   
    country: "pl" | <other types in future>,
    cityId:: String 
}
*/