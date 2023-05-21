const config = {
    VERBOSE: true,
    TEST_MODE: false,
    // BACKEND_URL: 'http://localhost:8080',
    BACKEND_URL: `http://${location.hostname}:8080`,
    USE_HASH_ROUTING: true,
    /**
     * For each station, there's a timer that counts how long the station has been assigned for
     * Timer starts from 00:00 in MM:SS (Minutes:Seconds) format
     * yellow: (Indicates Warning, Running out of Time) if the time reaches this 'yellow' time, the color font of the time turns yellow
     * red: (Indicates Time Limit, Exceeding Planned Time Allotted) if the time reaches this 'red' time, the color font of the time turns red
     */
    stationTimes: {
        UIA: {
            yellow: '5:00',
            red: '8:00',
        },
        GEO: {
            yellow: '5:00',
            red: '8:00',
        },
        ROV: {
            yellow: '10:00',
            red: '15:00',
        }
    }
};

export default config as any;