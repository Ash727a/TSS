<h1 align="center">
  :man_astronaut: S.U.I.T.S. Telemetry Stream Server :woman_astronaut:
<br>
| CAPCOM |
</h1>
<h4 align="center">
  :telescope: CAPCOM Web Interface for the S.U.I.T.S. Telemetry Stream Server :rocket:
</h4>

---

<h5 align="center">
  <a href="https://microgravityuniversity.jsc.nasa.gov/nasasuits">NASA SUITS Website</a> •
  <a href="#earth_americas-for-suits-teams">For SUITS Teams</a> •
  <a href="#computer-for-nasa-team">For NASA Team</a>
</h5>

---
<br>

## :earth_americas: For SUITS Teams
1. Clone the repository...
```
git clone https://github.com/SUITS-Techteam/TSS.git
```
2. Navigate into the root of the repository
3. Navigate to `/backend`
7. Run...
```
npm i
```
8. Run...
```
npm run dev
```
In another terminal, start the simulation through an http GET request:
```
curl http://localhost:8080/api/simulationControl/sim/1/start
```
8. Power up your VISION Kit
    * If you haven't already, be sure to change the host URL in your VISION Kit (see [VISION Kit Setup](#vision-kit-setup) below).  
    * If everything is connected correctly, you will begin generating data from your VISION Kit, and it will be sent to the server.
## VISION Kit Setup 🥽
### Adding Network to VISION Kit and Updating Host IP
Once you have your test environment set up and your server host established you will need to go into your VK and change the SUITS_TSSHOST environment variable to 
your server host IP. 

1. Connect a monitor and keyboard to your VK. 
2. Once the system is running and you have a prompt, you must connect the VK to the wifi network you'll run the test server on. Start by entering the following command:
    ``` bash
    sudo raspi-config
    ```
    Navigate to `Network Options` with the arrow keys and press enter
    
    Select `Wi-Fi` and follow the steps to add your ssid and password
    
    Select finish to close raspi-config

3. Next you need to update the SUITS_TSSHOST file on the vision kit. Enter the following commands:
    ``` bash
    cd TSS_Client
    nano .env
    ```
    Then add your server host IP address to the right side of `SUITS_TSSHOST=`.
    
    Press Ctrl + o to save then Ctrl + x to exit

4. Now restart your VK by running:
    ``` bash
    sudo reboot
    ```
    If your server is running and your SUITS_TSSHOST address is correct your VK should automatically start sending GPS data to the server!

### You're good to go! 🎉

<br>

## :computer: For NASA Team

1. Clone the repository...
```
git clone https://github.com/NASA-SUITS-techteam/TSS.git
```
3. Navigate to `/frontend`
4. Run...
```
npm i
```
5. Run...
```
npm start
```
6. In another terminal navigate to `/backend`
7. Run...
```
npm i
```
8. Run...
```
npm run dev
```
9. Open in your browser
```
localhost:4200
```

## EVA Errors
| Error      | State Key | Nominal Max | Nominal Min | Error Max | Error Min |
| ---------- | --------- | ----------- | ----------- | --------- | --------- |
| Heart Rate | heart_rate | 100          | 80          | 120       | 101       |
| Suit Pressure | suit_pressure    | 4.0         | 2.0        | 1.9       | 1.0      |
| Fan        | fan_tachometer     | 40,000.0    | 10,000.0    | 9,999.0  | 1,000.0  |
| O2 Pressure | o2_pressure      | 950         | 750         | 749       | 650       |
| O2 Rate    | o2_rate    | 1           | 0.5         | 0.4       | 0.1       |
| Battery Capacity | battery_capacity | 30 | 0 | 50 | 31 |

