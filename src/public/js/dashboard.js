var senderId = $('#senderId').text();
var receiverId; 
var image;
var lastLogoutTime;

const socket = io('/user-namespace', {
    auth: {
        token: senderId,
    }
})


$(document).ready(function() {
    $.ajax({
        url: 'http://localhost:3010/api/auth/list',
        type: 'GET',
        success: function(data) {
            if(data.success) {
                list = data.list
                listStatus = data.is_online
                for (let i in data.list) {
                    updateActivityStatus(list[i]._id, listStatus[i].is_online)
                }
            }
            else {
                alert(data.msg)
            }
        }
    })  

    $('.user-list').click(function(){
        const $userItems = $("#chat-container");
        const colorList = ["#d9f6f6", "#dfe7fe", "#f0d3e2", "#def2ee", "#d7f4dc", "#eae4b9", "#c1c8e3"];
        
        $userItems.each(function() {
            const randomColor = colorList[Math.floor(Math.random() * colorList.length)];
            $(this).css("background-color", randomColor);
        });
        
        var userId = $(this).attr('data-id')
        image = $('#image').attr('data-id')

        receiverId  = userId
        $('.start-head').hide();
        $('.chat-section').show();
        
        socket.emit('existsChat', { sender_id: senderId, receiver_id: receiverId});
    })
});

// set onl_off
socket.on('setOnline', (data) => {
    $('#' + data.userId + '-status').removeClass('status-indicator_offline')
    $('#' + data.userId + '-status').add('status-indicator_online')
})

socket.on('setOffline', (data) => {
    $('#' + data.userId + '-status').removeClass('status-indicator_online')
    $('#' + data.userId + '-status').add('status-indicator_offline')
})

// chat form
$('#chat-form').submit(function(event) {
    event.preventDefault();
    var message = $('#message').val()  
    $.ajax({
        url: 'http://localhost:3010/api/auth/save-chat',
        type: 'POST',
        data: {
            sender_id: senderId,
            receiver_id: receiverId,
            message,
            image,
        },
        success: function(data) {
            if(data.success) {
                $('#message').val('')
                let chat = data.chatMessage.message
                let html = 
                `<div class="current-user-chat">
                    <div class="current-content-user-chat">
                        <h5>`+ chat +`</h5>
                    </div>
                </div>`

                $('#chat-container').append(html)
                socket.emit('show-chat', data.chatMessage)
                scrollChat()
            }
            else {
                alert(data.msg)
            }
        }
    })
})

// load new chat
socket.on('loadNewChat', (data) => {
    if(senderId == data.receiver_id && receiverId == data.sender_id) {
        var imageSrc = "/images/" + data.image;
        let html =
        `<div class="distance-user-chat">
            <div class="image-user-chat">
                <img src=`+ imageSrc +` alt="" class="user-image">
            </div>
            <div class="distance-content-user-chat">
            <h5>`+ data.message +`</h5>
            </div>
        </div>`
        $('#chat-container').append(html);
    }
    scrollChat()
})

// load chat
socket.on('loadChat', (data) => {
    $('#chat-container').html('');
    var chat = data.chat
    let html = ''
    var imageSrc = "/images/" + data.image;

    for (let i = 0; i < chat.length; i++) {
        if(chat[i]['sender_id'] == senderId) {
            html +=
            `<div class="current-user-chat">
                <div class="current-content-user-chat">
                    <h5>`+ chat[i]['message'] +`</h5>
                </div>
            </div>`
        }
        else {
            html += 
            `<div class="distance-user-chat">
                <div class="image-user-chat">
                    <img src=`+ imageSrc +` alt="" class="user-image">
                </div>
                <div class="distance-content-user-chat">
                <h5>`+ chat[i]['message'] +`</h5>
                </div>
            </div>`;
        }  
    }
    $('#chat-container').append(html);
    scrollChat()
})

// set up scroll chat
function scrollChat() {
    $('#chat-container').animate({
        scrollTop: $('#chat-container').offset().top + $('#chat-container')[0].scrollHeight
    }, 0)
}

// set time status
function getTime(date) {
    let currentDate = new Date();

    let diff = currentDate - date;
    
    if (diff < 1000 * 10) return "just now"; // < 10s
    else if (diff < 1000 * 60) {             // < 1p
        let diffSecs = Math.floor(Math.abs(diff) / 1000);
        return diffSecs + " secs ago";
    }  
    else if (diff < 1000 * 60 * 60) {         // < 1h
        let diffMins = Math.round(((diff % 86400000) % 3600000) / 60000); 
        return diffMins + " mins ago";
    }
    else if (diff < 1000 * 60 * 60 * 24) {     // < 24h 
        let diffHours = Math.round((diff % 86400000) / 3600000);
        return diffHours + " hours ago"; 
    }
    else {
        let diffDays = Math.floor(diff / 86400000); 
        return diffDays + " days ago";
    }
}

function updateActivityStatus(id, status) {
    const activityTime = $('#'+ id);
    const lastLogoutTime = new Date(activityTime.attr('data-time'));
    const elapsedTime = getTime(lastLogoutTime);
    if (status == "1") {
        activityTime.text("just now");
    } else {
        activityTime.text(elapsedTime);
    }  
}