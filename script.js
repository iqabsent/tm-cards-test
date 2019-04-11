const state = {
    availableCards: [],
    selectedCards: [],
    totalCredit: 0
}

const cards = [
    {
        name: "Student Life",
        apr: 18.9,
        btDuration: 0,
        purchaseDuration: 6,
        credit: 1200,
        requirements: [{
            type: "occupationIs",
            value: "student"
        }]
    },
    {
        name: "Anywhere Card",
        apr: 33.9,
        btDuration: 0,
        purchaseDuration: 0,
        credit: 300,
        requirements: []
    },
    {
        name: "Liquid Card",
        apr: 33.9,
        btDuration: 12,
        purchaseDuration: 6,
        credit: 3000,
        requirements: [{
            type: "minIncome",
            value: 16000
        }]
    }
]

const requirementEvaluators = {
    occupationIs: (applicantData, requirement) => applicantData.occupation === requirement.value,
    minIncome: (applicantData, requirement) => applicantData.income >= requirement.value,
}

function checkRequirements(card, applicantData) {
    // check that every requirement is met
    return card.requirements.every(
        requirement => {
            const evaluator = requirementEvaluators[requirement.type]
            if (typeof evaluator !== 'function') {
                console.warn(`No requirement evaluator for ${requirement.type} requirement on ${card.name}`)
                return false // unrecognised requirement: not met by default
            }
            return evaluator(applicantData, requirement)
        }
    )
}

function sanitise(text) { // creates URI-friendly version of a string
    if (typeof text !== 'string') { return text }
    return encodeURIComponent(text.toLowerCase().replace(/\s/g,'-'))
}

function handleFormSubmit(e) {
    e.preventDefault()
    const formData = {
        // just what we care about .. for now
        income: document.querySelector('[name=income]').value,
        occupation: document.querySelector('[name=occupation]:checked').value
    }
    state.availableCards = cards.filter(card => checkRequirements(card, formData));
    document.querySelector('#form').classList.add('hidden')
    document.querySelector('#results').classList.remove('hidden')
    // render total credit and available cards
    renderTotalCredit(0)
    renderAvailableCards(state.availableCards)
}

function handleToggleSelect(cardName) {
    const selectedCards = state.selectedCards;
    const cardIndex = selectedCards.indexOf(cardName);
    // update selectedCards in state
    (cardIndex === -1)
        ? selectedCards.push(cardName)
        : selectedCards.splice(cardIndex, 1)
    // recalculate totalCredit in state 
    state.totalCredit = state.availableCards.reduce(
        (accumulator, card) => accumulator + (selectedCards.includes(sanitise(card.name)) ? card.credit : 0),
        0
    )
    // re-render total credit and available cards
    renderTotalCredit(state.totalCredit);
    renderAvailableCards(state.availableCards);
}

function renderAvailableCards(cards) {
    const container = document.querySelector('#available')
    const newList = document.createDocumentFragment()
    cards.forEach(card => {
        const element = document.createElement('li')
        const isSelected = state.selectedCards.includes(sanitise(card.name))
        let action = 'Select'
        if (isSelected) {
            action = 'Remove'
            element.classList.add('selected')
        }
        element.classList.add('card')
        element.innerHTML = `
            <h3 class='card-name'>${card.name}</h3>
            <div class='card-image'></div>
            <div class='card-info'>
                <div>${card.apr}% APR</div>
                <div>${card.btDuration ? card.btDuration + ' months' : 'No'}  BT offer</div>
                <div>${card.purchaseDuration ? card.purchaseDuration + ' months' : 'No' } Purchase offer</div>
                <div>&pound;${card.credit} credit limit</div>
            </div>
            <button onclick='handleToggleSelect(sanitise("${card.name}"))'>${action}</button>
        `
        newList.append(element)
    })
    container.innerHTML = ''
    container.append(newList)
}

function renderTotalCredit(totalCredit) {
    document.getElementById('credit').innerHTML = `Total credit provided by selected cards: &pound;${totalCredit}`
}