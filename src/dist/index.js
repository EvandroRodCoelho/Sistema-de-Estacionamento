(function () {
    var _a;
    const $ = (query) => document.querySelector(query);
    function calculateTime(mil) {
        const min = Math.floor(mil / 60000);
        const seg = Math.floor((mil % 60000) / 1000);
        return `${min} minutos  e ${seg} segundos`;
    }
    function parking() {
        function read() {
            return localStorage.parking ? JSON.parse(localStorage.parking) : [];
        }
        function save(vehicles) {
            localStorage.setItem("parking", JSON.stringify(vehicles));
        }
        function add(vehicle, toSaves) {
            var _a, _b;
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${vehicle.name}</td>
                <td>${vehicle.licensePlate}</td>
                <td>${vehicle.time}</td>
                <td>
                    <button id="delete" data-licensePlate="${vehicle.licensePlate}"
                    class="btn btn-danger">X</button>
                </td>
            `;
            (_a = row.querySelector("#delete")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
                remove(this.dataset.licensePlate);
            });
            (_b = $("#parking")) === null || _b === void 0 ? void 0 : _b.appendChild(row);
            if (toSaves)
                save([...read(), vehicle]);
        }
        function remove(licensePlate) {
            const { time, name } = read().find(vehicle => vehicle.licensePlate !== licensePlate);
            const totalTime = calculateTime(new Date().getTime() - new Date(time).getTime());
            if (!confirm(`O veículo ${name} Permaneceu por ${totalTime}, deseja encerrar?`))
                return;
            save(read().filter(vehicle => vehicle.licensePlate !== licensePlate));
            render();
        }
        function render() {
            $("#parking").innerHTML = "";
            const parking = read();
            if (parking.length) {
                parking.forEach(vehicle => add(vehicle));
            }
        }
        return { read, remove, add, save, render };
    }
    parking().render();
    (_a = $("#register")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        var _a, _b;
        const name = (_a = $("#name")) === null || _a === void 0 ? void 0 : _a.value;
        const licensePlate = (_b = $("#licensePlate")) === null || _b === void 0 ? void 0 : _b.value;
        if (!name || !licensePlate) {
            alert("DIgite todos os items");
            return;
        }
        parking().add({ name, licensePlate, time: new Date().toISOString() }, true);
    });
})();
