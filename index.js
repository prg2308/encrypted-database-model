function partitionFunction(condition) {

    switch (condition.attribute) {
        case 'name':
            if (condition.value[0].toLowerCase() >= 'a' && condition.value[0].toLowerCase() <= 'i') {
                return 1
            }
            else if (condition.value[0].toLowerCase() >= 'j' && condition.value[0].toLowerCase() <= 'p') {
                return 2
            }
            else if (condition.value[0].toLowerCase() >= 'q' && condition.value[0].toLowerCase() <= 'z') {
                return 3
            }
            else {
                return -1
            }
        case 'ssn':
            if (parseInt(condition.value[condition.value.length - 1]) >= 0 && parseInt(condition.value[condition.value.length - 1]) <= 4) {
                return 4
            }
            else if (parseInt(condition.value[condition.value.length - 1]) >= 5 && parseInt(condition.value[condition.value.length - 1]) <= 9) {
                return 5
            }
            else {
                return -1
            }
        case 'rank':
            switch (condition.value) {
                case 'manager': return 6
                case 'secretary': return 7
                case 'admin': return 8
                case 'analyst': return 9
                default: return -1
            }
        case "salary":
            if (parseInt(condition.value) >= 0 && parseInt(condition.value) <= 30000) {
                return 10
            }
            else if (parseInt(condition.value) >= 30000 && parseInt(condition.value) < 50000) {
                return 11
            }
            else if (parseInt(condition.value) >= 50000 && parseInt(condition.value) < 65000) {
                return 12
            }
            else if (parseInt(condition.value) >= 65000) {
                return 13
            }
            else {
                return -1
            }

        default: return -1
    }
}


function queryDestructor(query) {

    query = query.toLowerCase();
    switch (query.substring(0, 6)) {
        case 'select': {
            queryType = 'select';
            queryArray = query.split('from');
            let attributes = queryArray[0].split('select')
            let conditions = queryArray[1].split('where')
            const tableName = conditions[0].trim()
            conditions = conditions[1].split('and')

            conditions = conditions.map(conditions => {
                return conditions.trim()
            })
            conditions = conditions.map(condition => {
                return { attribute: condition.match(/(?:[^\s"]+|"[^"]*")+/g)[0], operator: condition.match(/(?:[^\s"]+|"[^"]*")+/g)[1], value: condition.match(/(?:[^\s"]+|"[^"]*")+/g)[2].replace(new RegExp('\"', 'g'), '') }
            })

            attributes.shift()
            attributes = attributes[0].split(',')
            attributes = attributes.map(attributes => {
                return attributes.trim()
            })

            return { tableName, queryType, attributes, conditions }
        }
        case 'update': {
            queryType = 'update';
            queryArray = query.split('set');
            const tableName = queryArray[0].split('update')[1].trim();
            let conditions = queryArray[1].split('where')
            let attributes = conditions[0].split(',')
            conditions = conditions[1].split('and')

            conditions = conditions.map(conditions => {
                return conditions.trim()
            })
            conditions = conditions.map(condition => {
                return { attribute: condition.match(/(?:[^\s"]+|"[^"]*")+/g)[0], operator: condition.match(/(?:[^\s"]+|"[^"]*")+/g)[1], value: condition.match(/(?:[^\s"]+|"[^"]*")+/g)[2].replace(new RegExp('\"', 'g'), '') }
            })

            attributes = attributes.map(attributes => {
                return attributes.trim()
            })
            attributes = attributes.map(attribute => {
                return { attribute: attribute.match(/(?:[^\s"]+|"[^"]*")+/g)[0], operator: attribute.match(/(?:[^\s"]+|"[^"]*")+/g)[1], value: attribute.match(/(?:[^\s"]+|"[^"]*")+/g)[2].replace(new RegExp('\"', 'g'), '') }
            })

            return { tableName, queryType, attributes, conditions }
        }
    }
}


const selectQ = queryDestructor('SELECT name , salary from EMPLOYEES WHERE name = "John Doe" and salary <= 650000 ')
const updateQ = queryDestructor('UPDATE EMPLOYEES SET name = "John Doe", salary = 650000 WHERE name = "John Die" and empId = 6969')

console.log(updateQ)