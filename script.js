const cards = [
    {
        name: "Student Life",
        apr: 18.9,
        btDuration: 0,
        purchaseDuration: 6,
        credit: 1200,
        requirements: [{
            type: "occupationIs",
            field: "occupation",
            value: "student"
        }]
    },
    {
        name: "Anywhere Card",
        apr: 33.9,
        bt_duration: 0,
        p_duration: 0,
        credit: 300,
        requirements: []
    },
    {
        name: "Liquid Card",
        apr: 33.9,
        bt_duration: 12,
        p_duration: 6,
        credit: 3000,
        requirements: [{
            type: "minIncome",
            field: "income",
            value: 16000
        }]
    }
]

const requirementEvaluators = {
    occupationIs: (value, requirement) => value === requirement,
    minIncome: (value, requirement) => value >= requirement,
}

function checkRequirements(card, applicantData) {
    // check that every requirement is met
    return card.requirements.every(
        requirement => {
            const evaluator = requirementEvaluators[requirement.type]
            if (typeof evaluator !== 'function') {
                console.warn(`No requirement evaluator for ${requirement.type} requirement on ${card.name}`)
                return false // requirement not met by default
            }
            return evaluator(applicantData[requirement.field], requirement.value)
        }
    )
}

function handleFormSubmit(e) {
    e.preventDefault()
    
    const formData = {
        // just what we care about .. for now
        income: document.querySelector('[name=income]').value,
        occupation: document.querySelector('[name=occupation]:checked').value
    }

    const availableCards = cards.filter(card => checkRequirements(card, formData));

    console.log(availableCards)
}