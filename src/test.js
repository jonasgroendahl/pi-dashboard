axios.get(`/v1/pi?gym_id=${this.state.gym_id}`).then(res => {
    console.log(res);
    this.setState({ pis: res.data });
});
axios
    .get(`/v1/pi/blocks?gym_id=${this.state.gym_id}`)
    .then(res => {
        console.log("blocks", res);
        this.setState({ blocks: res.data });
    });
axios
    .get(`/v1/pi/content?gym_id=${this.state.gym_id}`)
    .then(res => {
        console.log("content", res);
        const data = res.data.map(piC => ({ ...piC, content_id: piC.id }));
        this.setState({ picontent: data });
    });
axios
    .get(`/v1/pi/calendars?gym_id=${this.state.gym_id}`)
    .then(res => {
        if (res.data.length > 0) {
            res = res.data.map(calendar => ({
                name: calendar.name,
                id: calendar.id
            }));
            this.setState({ calendars: res, selectedCalendar: res[0].id });
        }
    });