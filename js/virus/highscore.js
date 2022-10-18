const VIRUS_HIGHSCORE_KEY = 'virus-highscore';

class Highscore {
    constructor() {
        this.data = localStorage.getItem(VIRUS_HIGHSCORE_KEY);
        this.data = this.data ? JSON.parse(this.data) : [];

        this.table = document.createElement('table');

        this.thead = this.table.createTHead();
        this.tbody = this.table.createTBody();
        this.header = this.thead.insertRow();

        this.header.insertCell().outerHTML = '<th>RANK</th>';
        this.header.insertCell().outerHTML = '<th>NAME</th>';
        this.header.insertCell().outerHTML = '<th>SCORE</th>';
    }

    insert(data) {
        this.data.push(data);
        this.data.sort((a, b) => b.score - a.score);

        localStorage.setItem(VIRUS_HIGHSCORE_KEY, JSON.stringify(this.data));
    }

    render(appendTo) {
        this.tbody.innerHTML = '';

        this.data.forEach((item, index) => {
            const row = this.tbody.insertRow();
            row.insertCell().innerText = index + 1;
            row.insertCell().innerText = item.name;
            row.insertCell().innerText = item.score;
            row.insertCell().innerText = item.time;
        });

        appendTo.append(this.table);
    }
}

export default Highscore;