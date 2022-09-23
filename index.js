function partitionFunction(condition) {

    switch (condition.operator) {
        case '=': {
            switch (condition.attribute) {
                case 'name':
                    if (condition.value[0].toLowerCase() >= 'a' && condition.value[0].toLowerCase() <= 'i') {
                        return [1]
                    }
                    else if (condition.value[0].toLowerCase() >= 'j' && condition.value[0].toLowerCase() <= 'p') {
                        return [2]
                    }
                    else if (condition.value[0].toLowerCase() >= 'q' && condition.value[0].toLowerCase() <= 'z') {
                        return [3]
                    }
                    else {
                        return -1
                    }
                case 'ssn':
                    if (parseInt(condition.value[condition.value.length - 1]) >= 0 && parseInt(condition.value[condition.value.length - 1]) <= 4) {
                        return [4]
                    }
                    else if (parseInt(condition.value[condition.value.length - 1]) >= 5 && parseInt(condition.value[condition.value.length - 1]) <= 9) {
                        return [5]
                    }
                    else {
                        return -1
                    }
                case 'rank':
                    switch (condition.value) {
                        case 'manager': return [6]
                        case 'secretary': return [7]
                        case 'admin': return [8]
                        case 'analyst': return [9]
                        default: return -1
                    }
                case "salary":
                    if (parseInt(condition.value) >= 0 && parseInt(condition.value) <= 30000) {
                        return [10]
                    }
                    else if (parseInt(condition.value) >= 30000 && parseInt(condition.value) < 50000) {
                        return [11]
                    }
                    else if (parseInt(condition.value) >= 50000 && parseInt(condition.value) < 65000) {
                        return [12]
                    }
                    else if (parseInt(condition.value) >= 65000) {
                        return [13]
                    }
                    else {
                        return -1
                    }

                default: return -1
            }
        }
        default: {
            try {
                let value, operator, array
                switch (condition.attribute) {
                    case 'name':
                        value = condition.value[0].toLowerCase()
                        operator = condition.operator
                        array = []
                        if (eval(` 'a' ${operator} '${value}'`) || eval(` 'i' ${operator} '${value}'`)) {
                            array.push(1)
                        }
                        if (eval(` 'j' ${operator} '${value}'`) || eval(` 'p' ${operator} '${value}'`)) {
                            array.push(2)
                        }
                        if (eval(` 'q' ${operator} '${value}'`) || eval(` 'z' ${operator} '${value}'`)) {
                            array.push(3)
                        }
                        if (!array.length) {
                            return -1
                        }
                        return array
                    case 'ssn':
                        if (parseInt(condition.value[condition.value.length - 1]) >= 0 && parseInt(condition.value[condition.value.length - 1]) <= 4) {
                            return [4]
                        }
                        else if (parseInt(condition.value[condition.value.length - 1]) >= 5 && parseInt(condition.value[condition.value.length - 1]) <= 9) {
                            return [5]
                        }
                        else {
                            return -1
                        }
                    case 'rank':
                        switch (condition.value) {
                            case 'manager': return [6]
                            case 'secretary': return [7]
                            case 'admin': return [8]
                            case 'analyst': return [9]
                            default: return -1
                        }
                    case "salary":
                        value = parseInt(condition.value)
                        operator = condition.operator
                        array = []

                        if (value < 0) {
                            return -1
                        }
                        if (eval(`0 ${operator} ${value}`) || eval(`30000 ${operator} ${value}`)) {
                            array.push(10)
                        } //Swap
                        if (eval(`30001 ${operator} ${value}`) || eval(`50000 ${operator} ${value} `)) {
                            array.push(11)
                        }
                        if (eval(`50001 ${operator} ${value}`) || eval(`65000 ${operator} ${value}`)) {
                            array.push(12)
                        }
                        if (value >= 65001) {
                            array.push(13)
                        }
                        if (!array.length) {
                            return -1
                        }
                        return array

                    default: return -1
                }
            } catch (e) {
                console.log(e)
                return -1
            }
        }
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

function bitIndexArray(query) {
    try {
        const dQuery = queryDestructor(query)
        const { conditions, attributes } = dQuery
        let bitIndexArray = []
        conditions.forEach(condition => {
            const indices = partitionFunction(condition)
            if (indices === -1) {
                throw new Error('Invalid Query')
            }
            //bitIndexArray.push(indices)
            bitIndexArray = bitIndexArray.concat(indices)
        })

        return { bitIndexArray: [...new Set(bitIndexArray)], attributes }
    } catch (e) {
        console.log('Error', e)
    }
}
const selectQ = 'SELECT name, salary from EMPLOYEES WHERE name = "John Doe" and salary >= 30000 salary <= 60000'
const updateQ = 'UPDATE EMPLOYEES SET name = "John Doe", salary = 65000 WHERE name = "John Die" and salary >= 50000 and ssn = 87'
console.log(bitIndexArray(selectQ))
