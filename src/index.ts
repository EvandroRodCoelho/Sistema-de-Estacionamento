interface Vehicle {
    name: string;
    licensePlate: string;
    time: Date | string;
}



const $ = (query: string): HTMLInputElement | null => document.querySelector(query)
function calculateTime(mil: number) {
    const min = Math.floor(mil / 60000)
    const seg = Math.floor((mil % 60000) / 1000)
    return `${min} minutos  e ${seg} segundos`
}

function parking() {
    function read(): Vehicle[] {
        return localStorage.parking ? JSON.parse(localStorage.parking) : []
    }
    function save(vehicles: Vehicle[]) {
        localStorage.setItem("parking", JSON.stringify(vehicles))
    }
    function add(vehicle: Vehicle, toSaves?: boolean) {
        const row = document.createElement("tr")
        row.innerHTML = `
                <td class="text-wrap ">${vehicle.name}</td>
                <td>${vehicle.licensePlate}</td>
                <td>${vehicle.time}</td>
                <td class="p-2">
                    <button id="delete" data-licenseplate="${vehicle.licensePlate}"
                    class="btn btn-danger">X</button>
                </td>
            `
        row.querySelector("#delete")?.addEventListener("click", function () {
            remove(this.dataset.licenseplate)
        })
        $("#parking")?.appendChild(row)
        if (toSaves) save([...read(), vehicle])
    }
    function remove(licensePlate: string) {

        const { time, name } = read().find(vehicle => vehicle.licensePlate === licensePlate);


        const totalTime = calculateTime(new Date().getTime() - new Date(time).getTime())
        if (
            !confirm(`O veículo ${name} Permaneceu por ${totalTime}, deseja encerrar?`)
        ) return

        save(read().filter(vehicle => vehicle.licensePlate !== licensePlate && vehicle.time !== time))
        render()
    }

    function render() {
        $("#parking")!.innerHTML = ""
        const parking = read()
        if (parking.length) {
            parking.forEach(vehicle => add(vehicle))
        }
    }

    return { read, remove, add, save, render }
}
parking().render()

$("#register")?.addEventListener("click", () => {
    const name = $("#name")?.value
    const licensePlate = $("#licensePlate")?.value

    if (!name || !licensePlate) {
        alert("DIgite todos os items")
        return
    }
    parking().add({ name, licensePlate, time: new Date().toISOString() }, true)
})
