function dashToDate(date) {

    let months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ]

    let newDate = new Date(date)
    let newDateString = `${newDate.getFullYear()} ${months[newDate.getUTCMonth()]} ${newDate.getUTCDate()}`
    return newDateString
}

module.exports = dashToDate