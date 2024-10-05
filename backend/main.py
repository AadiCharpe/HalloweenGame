import asyncio
import websockets
import json
import time

clients = set()
clients_id = {}
startTime = time.time()
bullets = [{"x": 500, "y": 300}]
state = {"bullets": bullets}
nextID = 0

async def connect(websocket):
    global nextID
    clients.add(websocket)
    clients_id[websocket] = nextID
    client_id = nextID
    await websocket.send(json.dumps({"id": client_id}))
    nextID += 1
    print(f"New client connected: {websocket.remote_address}, assigned ID: {client_id}")
    return client_id

async def disconnect(websocket):
    index = clients.indexOf(websocket)
    clients.remove(websocket)
    del state.clients_id[websocket]
    del clients_id.websocket
    print(f"Client disconnected: {websocket.remote_address}")

async def broadcast(message):
    if clients:
        await asyncio.wait([asyncio.create_task(client.send(message)) for client in clients])

async def handler(websocket, path):
    client_id = await connect(websocket)
    try:
        async for message in websocket:
            print(message)
            data = json.loads(message)
            # Update state based on incoming data if needed
            await broadcast(json.dumps(data))  # Broadcast received data to all clients
    finally:
        await disconnect(websocket)

async def main():
    async with websockets.serve(handler, "0.0.0.0", 6789):
        print("Server started at ws://localhost:6789")
        await asyncio.Future()

asyncio.run(main())
