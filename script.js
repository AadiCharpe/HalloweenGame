import kaboom from "https://unpkg.com/kaboom@3000.0.1/dist/kaboom.mjs";

const ws = new WebSocket('ws://192.168.1.35:6789');

let data = {};
let id = -1;

ws.onopen = ()=>{
    console.log('Connected to the server')
}

ws.onmessage = (event)=>{
    const messageData = JSON.parse(event.data);
    console.log('Received:', data);
    if (messageData.id !== undefined) {
        id = messageData.id;
        console.log('Assigned ID:', id);
    } else {
        // Handle other messages (e.g., game state updates)
        data = messageData;
    }
}

ws.onclose = ()=>{
    console.log('Disconnected from the server');
}

function sendMessage() {
    ws.send(JSON.stringify(data));
}

kaboom({
    width: 1000,
    height: 600
});

scene("title", ()=>{
    add([
        rect(width(), height()),
        color(227, 136, 0)
    ])
    add([
        rect(width() / 3, height() / 10),
        anchor("center"),
        pos(width() / 2, height() / 2),
        color(210,210,210)
    ])
    add([
        text("Halloween Game"),
        anchor("center"),
        scale(2),
        pos(width() / 2, height() / 4)
    ])
    const input = add([
        text("Enter Name"),
        anchor("center"),
        pos(width() / 2, height() / 2),
        scale(1.3)
    ])
    add([
        rect(100, 75),
        anchor("center"),
        pos(width() * 0.75, height() / 2),
        area(),
        color(50, 50, 50),
        "button"
    ])
    add([
        text("Join"),
        anchor("center"),
        pos(width() * 0.75, height() / 2)
    ])
    onCharInput((ch) => {
        if(input.text.length <= 10) {
            if(input.text === "Enter Name")
                input.text = "";
            input.text += ch;
        }
    })
    onClick("button", ()=>{
        if(input.text != "Enter Name") {
            go("game");
            sendMessage();
        }
    })
})

scene("game", ()=>{
    add([
        rect(width(), height()),
        color(127, 235, 75)
    ])
    const player = add([
        circle(16),
        anchor("center"),
        pos(width() / 2, height() / 2),
        color(226, 38, 27),
        area()
    ])
    onKeyDown("left", ()=>{
        player.move(-100, 0);
    })
    onKeyDown("right", ()=>{
        player.move(100, 0);
    })
    onKeyDown("up", ()=>{
        player.move(0, -100);
    })
    onKeyDown("down", ()=>{
        player.move(0, 100);
    })

    onUpdate(()=>{
        //data[id]["pos"] = player.pos;
        sendMessage();
        console.log(data)
    })
})

go("title")