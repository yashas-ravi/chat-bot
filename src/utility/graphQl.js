import { gql } from "@apollo/client";

//to get chats list from backend
export const GetChats=gql`
    subscription GetChats($userId:uuid!){
    chats(where:{user_id:{_eq:$userId}},order_by:{created_at:asc}){
      id
      title
    }
  }
`;

//to get the messages from the backend
export const GetMessages=gql`
    query GetMessages($chatId:uuid!){
        messages(where:{chat_id:{_eq:$chatId}},order_by:{created_at:asc}){
            id
            content
            sender
            created_at    
        }
    }
`;

//to save the message in backend  
export const InsertMessage=gql`
    mutation InsertMessage($chatId:uuid!, $content:String!){
        insert_messages_one(object:{chat_id:$chatId, content:$content, sender:"user"}){
            id
            content
            sender
        }
    }
`;

//create a chat
export const CreateChat=gql`
    mutation createChat($userId:uuid!, $title:String!){
        insert_chats_one(object:{user_id:$userId, title:$title}){
            id
            title
        }
    }
`;

//to trigger the chatbot
export const SendMessage=gql`
    mutation SendMessage($chatId:uuid!, $message:String!){
        sendMessage(chatId:$chatId, message:$message){
            content
        }
    }
`;

//to get messages at real time
export const MessageSubscription=gql`
    subscription MessageSubscription($chatId:uuid!){
        messages(where:{chat_id:{_eq:$chatId}},order_by:{created_at:asc}){
            id
            content
            sender
            created_at
        }
    }
`;


//to delete a chat
export const DeleteChat=gql`
    mutation DeleteChat($chatId:uuid!){
        delete_chats_by_pk(id:$chatId){
            id
        }
    }
`;

//to update chat
export const UpdateChat=gql`
    mutation UpdateChat($chatId:uuid!,$title:String!){
        update_chats_by_pk(pk_columns:{id:$chatId},_set:{title:$title}){
            id
        }
    }
`;