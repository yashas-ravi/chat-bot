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
    const [showChat, setShowChat]=useState("chat-menu close");
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
        if(window.screen.width<481){
            setIsMobile(true);
        }
    },[]);

    const logout = async() => {
        await nhost.auth.signOut();
        toast.info("User loged out");
    }

    const handleDrag=(e)=>{
        e.preventDefault();
        let startX=0, startY=0;
        const div = document.getElementById('floatChat');
        div.addEventListener(isMobile?'touchstart':'mousedown',(e)=>{
            // startX=isMobile?e.touches[0].clientX:e.clientX;
            // startY=isMobile?e.touches[0].clientY:e.clientY;
            document.addEventListener(isMobile?'touchmove':'mousemove',mouseMove);
            document.addEventListener(isMobile?'touchend':'mouseup',mouseUp);
        });
            const mouseMove=(e)=>{
                div.style.cursor='grabbing';
                // newX=startX-e.clientX;
                // newY=startY-e.clientY;
                startX=isMobile?e.touches[0].clientX:e.clientX;
                startY=isMobile?e.touches[0].clientY:e.clientY;
                div.style.top=startY+'px';
                div.style.left=startX+'px';
            };
            const mouseUp=(e)=>{
                document.removeEventListener(isMobile?'touchmove':'mousemove',mouseMove);
            };
      };

    const handleCreateChat = async()=>{
        try{    
            const {data} = await createChat({
            variables:{userId,title:'chat'+Math.floor(Math.random() * 9000)}
            });
            if(!data){
                 throw new Error("Failed to create chat");
            }
            else{
                const sdata = JSON.parse(JSON.stringify(data));
                toast.info("New Chat created");
                setPresentChat(sdata.insert_chats_one.id);
                setChatName(sdata.insert_chats_one.title);
            }
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
        document.getElementById("chat-input-holder").value='';
        if(!inputMessage.trim())return;
        try{
            await insertMessage({variables:{chatId:presentChat, content:inputMessage}});
            const {data} = await sendMessage({variables:{chatId:presentChat, message:inputMessage}});
            console.log(data);
            setBotResponse(data.sendMessage.content);
        }catch(e){
            console.log(e.message);
            if(e.message==="Foreign key violation. insert or update on table \"messages\" violates foreign key constraint \"messages_chat_is_fkey1\""){
                toast.info("Select a chat")
            }
        }
        setInputMessage("");
    }

    return <><div id='home' className="home">
        <div className="header">
            <h2>Subspace AI</h2>
            {!isMobile&&(<div id='authTab' className='userAuthTab'>
            <p>{email}</p>  
            <button onClick={logout}>Logout</button>
            </div>)}
            <div id='menuBtn' className='menuBtn' onClick={()=>setShowChat('chat-menu open')}><i className="fa-solid fa-bars"></i></div>
        </div>
        <div className="container-body">
            <div className={showChat}>
                {!isMobile?(<div className='newChatDiv'>
                <p onClick={handleCreateChat}>New Chat +</p>
                </div>):(<div className='closeMenuHolder'><div onClick={()=>setShowChat('chat-menu close')} className='closeMenu'><p>close</p><i className="fa-solid fa-xmark"></i></div></div>)}
                <div className='listChats'>
                {chatsLoading||chatDeleteLoading||chatCreateLoading||chatUpdateLoading?(<p>Loading Chats...</p>):chats.length===0?(<p>No Chats</p>):(chats.map((chat)=>(
                    <div onClick={()=>{setPresentChat(chat.id);setChatName(chat.title)}} key={chat.id} className={`${presentChat===chat.id?'chatDiv btnActive':'chatDiv'}`}>
                        <p>{chat.title}</p>
                        <div className='chatDivGi'><i className="fa-solid fa-pen-to-square" onClick={()=>{handleRenameChat(chat.id)}}></i>
                        <i className="fa-solid fa-trash" onClick={()=>handleDeleteChat(chat.id)}></i>
                        </div>
                    </div>)))}
                </div>
            {isMobile&&(<div className='userAuthTab'>
            <p>{email}</p>  
            <button onClick={logout}>Logout</button>
            </div>)}
            </div>
            {presentChat===null&&chats.length===0?(<div className='no-chat-message'><p>Create Chat and Start conversation</p></div>):presentChat===null&&chats.length>0?setPresentChat(chats[0].id) :(<div className="message-body">
                {chats.length>0&&(<p className='message-lobby-title'>Chat: {chatName}</p>)}
                <div className='messages'>
                {messagesLoading?(<p className='no-messages-to-show'>Messages loading</p>):messages.length===0?(<p className='no-messages-to-show'>No Messages :)</p>):messages.map((message)=>(
                    <div className={message.sender==='ai'?`message-left`:`message-right`} key={message.id}>
                        <p>{message.content}</p>
                    </div>
                ))}
                {insertMessageLoading?(<div className='message-right'><p>Sending...</p></div>):''}
                {sendMessageLoading?(<div className='message-left'><p>Typing...</p></div>):''}
                {botresponse&&!messages.some((msg)=>msg.content===botresponse)&&(
                    <div className='message-left'>
                        <p>{botresponse}</p>
                    </div>
                )}
                </div>
                {chats.length>0&&(<div id='chatInputs' className="chat-inputs">
                    <input id='chat-input-holder' type="text" onChange={(e)=>{setInputMessage(e.target.value);}} placeholder='Enter your message or question...'/>
                    <button onClick={(e)=>handleMessageSend(e)} disabled={insertMessageLoading||sendMessageLoading}>Send</button>
                </div>)}
            </div>)}
        </div>
        </div>
        {isMobile?(<div id='floatChat' onTouchStart={(e)=>{handleDrag(e)}} className='floatChatNew'><i className="fa-solid fa-arrows-up-down-left-right" onClick={(e)=>{handleDrag(e)}}></i><p>New Chat</p><i className="fa-solid fa-plus" onClick={handleCreateChat}></i></div>):''}
        <div id='chatPopup' className='chatPopup'><p>Enter New Chat Name</p><input type="text" onChange={(e)=>setchangeChatName(e.target.value)} required/><button onClick={handleRenameChatDone}>Rename</button></div>
        </>
} 

export default Home;