import { useEffect, useState } from 'react';
import {nhost} from '../utility/nhost';
import './home.css';
import { useMutation, useSubscription } from '@apollo/client';
import { CreateChat, DeleteChat, GetChats, InsertMessage, MessageSubscription, SendMessage, UpdateChat } from '../utility/graphQl';
import { toast } from 'react-toastify';

const Home = () => {
    const [email, setEmail] = useState("");  
    const [userId, setUserId] = useState("");
    const [chatId, setChatId] = useState("");
    const [chatName, setChatName]=useState("");
    const [isMobile, setIsMobile]=useState(false);  
    const [presentChat, setPresentChat]= useState(null);
    const [inputMessage, setInputMessage]=useState("");
    const [botresponse, setBotResponse] = useState(null);
    const [changeChatName, setchangeChatName] = useState('chat'+Math.floor(Math.random() * 9000));
    const [createChat, {loading:chatCreateLoading}] = useMutation(CreateChat);
    const [deleteChat, {loading:chatDeleteLoading}]= useMutation(DeleteChat);
    const [updateChat, {loading:chatUpdateLoading}]= useMutation(UpdateChat);
    const [insertMessage, {loading:insertMessageLoading}]= useMutation(InsertMessage);
    const [sendMessage, {loading:sendMessageLoading}]= useMutation(SendMessage);
    const {data:queryChats,loading:chatsLoading} = useSubscription(GetChats,{variables:{userId}});
    const {data:queryMessages, loading:messagesLoading}=useSubscription(MessageSubscription,{variables:{chatId:presentChat}});
    const chats = queryChats?.chats||[];
    const messages = queryMessages?.messages||[];

    useEffect(()=>{
        setEmail(nhost.auth.getUser().email);
        setUserId(nhost.auth.getUser().id);
        if(window.screen.width<480){
            setIsMobile(true);
        }
    },[])

    
    const logout = async() => {
        await nhost.auth.signOut();
        toast.info("User loged out");
    }

    const handleMenu=()=>{
        const menuBtn = document.getElementById('menuBtn');
        const authMenu = document.getElementById('authTab');
        const chatMenu = document.getElementById('chatMenu');

        menuBtn.addEventListener('click',()=>{
            if(chatMenu.style.display==='flex'){
            authMenu.style.display='none';
            chatMenu.style.display='none';
            authMenu.style.right='-200px';
            chatMenu.style.right='-200px';
            }
            else{
            authMenu.style.display='flex';
            chatMenu.style.display='flex';
            authMenu.style.right='90px';
            chatMenu.style.right='10px';
            }
        });
    }

    const handleCreateChat = async()=>{
        try{
            await createChat({
            variables:{userId,title:'chat'+Math.floor(Math.random() * 9000)}
        })
        }catch(e){
            console.log(e.message);
            toast.error(e.message);
        }
    }

    const handleDeleteChat = async(id)=>{
        try{
            await deleteChat({
            variables:{chatId:id}
        })
        toast.info("Chat deleted");
        }catch(e){
            console.log(e.message);
            toast.error(e.message);
        }
    }

    const handleRenameChat=(id)=>{
        setChatId(id);
        const chatpopup = document.getElementById('chatPopup');
        const home = document.getElementById('home');
        home.style.filter='blur(10px)';
        home.style.pointerEvents='none';
        chatpopup.style.display='flex';
    }

    const handleRenameChatDone=async()=>{
        const chatpopup = document.getElementById('chatPopup');
        const home = document.getElementById('home');
        home.style.filter='blur(0px)';
        home.style.pointerEvents='all';
        chatpopup.style.display='none';
        if(changeChatName.length>3){
        setChatName(changeChatName);
        try{
            await updateChat({variables:{chatId, title:changeChatName}});
            toast.info("Chat name renamed");
        }
        catch(e){
            console.log(e.message);
            toast.error(e.message);
        }
        }
    }

    const handleMessageSend=async(e)=>{
        e.preventDefault();
        const scrollMsg = document.getElementById('scroll-msg');
        document.getElementById("chat-input-holder").value='';
        if(!inputMessage.trim())return;
        try{
            await insertMessage({variables:{chatId:presentChat, content:inputMessage}});
            const {data} = await sendMessage({variables:{chatId:presentChat, message:inputMessage}});
            console.log(data);
            setBotResponse(data.sendMessage.content);
        }catch(e){
            console.log(e.message);
            // toast.error(e.message);
        }
        scrollMsg.scrollIntoView();
        setInputMessage("");
    }

    return <><div id='home' className="home">
        <div className="header">
            <h2>Subspace AI</h2>
            {!isMobile&&(<div id='authTab' className='userAuthTab'>
            <p>{email}</p>  
            <button onClick={logout}>Logout</button>
            </div>)}
            <div id='menuBtn' className='menuBtn' onClick={handleMenu}><i class="fa-solid fa-bars"></i></div>
        </div>
        <div className="container-body">
            <div id='chatMenu' className='chat-menu'>
                <div className='newChatDiv'>
                <p onClick={handleCreateChat}>New Chat +</p>
                </div>
                <div className='listChats'>
                {chatsLoading||chatDeleteLoading||chatCreateLoading||chatUpdateLoading?(<p>Loading Chats...</p>):chats.length===0?(<p>No Chats</p>):(chats.map((chat)=>(
                    <div onClick={()=>{setPresentChat(chat.id);setChatName(chat.title)}} key={chat.id} className={`${presentChat===chat.id?'chatDiv btnActive':'chatDiv'}`}>
                        <p>{chat.title}</p>
                        <div><i class="fa-solid fa-pen-to-square" onClick={()=>{handleRenameChat(chat.id)}}></i>
                        <i class="fa-solid fa-trash" onClick={()=>handleDeleteChat(chat.id)}></i>
                        </div>
                    </div>)))}
                </div>
            {isMobile&&(<div id='authTab' className='userAuthTab'>
            <p>{email}</p>  
            <button onClick={logout}>Logout</button>
            </div>)}
            </div>
            {presentChat===null&&chats.length===0?(<p className='no-chat-message'>Create Chat and Start conversation</p>):presentChat===null&&chats.length>0?(<p className='no-chat-message'>Select Chat to Start</p>):(<div className="message-body">
                <p className='message-lobby-title'>Chat: {chatName}</p>
                <div className='messages'>
                {messagesLoading?(<p className='no-messages-to-show'>Messages loading</p>):messages.length===0?(<p className='no-messages-to-show'>No Messages :)</p>):messages.map((message)=>(
                    <div className={message.sender==='ai'?`message-left`:`message-right`} key={message.id}>
                        <p id='scroll-msg'>{message.content}</p>
                    </div>
                ))}
                {sendMessageLoading?(<p>Typing...</p>):''}
                {botresponse&&!messages.some((msg)=>msg.content===botresponse)&&(
                    <div className='message-left'>
                        <p>{botresponse}</p>
                    </div>
                )}
                </div>
                <div className="chat-inputs">
                    <input id='chat-input-holder' type="text" onChange={(e)=>{setInputMessage(e.target.value);}} placeholder='Enter your message or question...'/>
                    <button onClick={(e)=>handleMessageSend(e)} disabled={insertMessageLoading||sendMessageLoading}>Send</button>
                </div>
            </div>)}
        </div>
        </div>
        <div id='chatPopup' className='chatPopup'><p>Enter New Chat Name</p><input type="text" onChange={(e)=>setchangeChatName(e.target.value)} required/><button onClick={handleRenameChatDone}>Rename</button></div>
        </>
} 

export default Home;