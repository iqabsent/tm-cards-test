(function () {
    // encapsulated, hidden data and functions
    const _getCards = () => {
        return [
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
        ].slice() // always a copy
    }
    // app to expose/export
    const app = {
        state: {
            availableCards: [], // cards for which requirements are met
            selectedCards: [], // card name hashes of selected cards
            totalCredit: 0 // total credit provided by selected cards
        },
        util: {
            requirementEvaluators: {
                occupationIs: (applicantData, requirement) => applicantData.occupation === requirement.value,
                minIncome: (applicantData, requirement) => applicantData.income >= requirement.value,
            },
            checkRequirements: (card, applicantData) => {
                // check that every requirement is met
                return card.requirements.every(
                    requirement => {
                        const evaluator = app.util.requirementEvaluators[requirement.type]
                        if (typeof evaluator !== 'function') {
                            console.warn(`No requirement evaluator for ${requirement.type} requirement on ${card.name}`)
                            return false // unrecognised requirement: not met by default
                        }
                        return evaluator(applicantData, requirement)
                    }
                )
            },
            hash: (text) => { // not a real hash; creates URI-friendly version of a string
                if (typeof text !== 'string') { return text }
                return encodeURIComponent(text.toLowerCase().replace(/\s/g,'-'))
            }
        },
        handlers: {
            formSubmit: (e) => {
                e.preventDefault()
                const formData = {
                    // just what we care about .. for now
                    income: document.querySelector('[name=income]').value,
                    occupation: document.querySelector('[name=occupation]:checked').value
                }
                app.state.availableCards = _getCards().filter(card => app.util.checkRequirements(card, formData))
                // hide form, show results
                document.getElementById('form').classList.add('hidden')
                document.getElementById('results').classList.remove('hidden')
                // render total credit and available cards
                app.render.totalCredit(0)
                app.render.availableCards(app.state.availableCards, app.state.selectedCards)
            },
            toggleSelectCard: (e) => {
                // we track selected cards with hashes of the card name only
                const cardNameHash = e.target.dataset.id
                const selectedCards = app.state.selectedCards
                const cardIndex = selectedCards.indexOf(cardNameHash)
                const isSelected = (cardIndex !== -1); // example of when you need a semicolon
                // update selectedCards in state
                (isSelected)
                    ? selectedCards.splice(cardIndex, 1)
                    : selectedCards.push(cardNameHash)
                // recalculate totalCredit in state 
                app.state.totalCredit = app.state.availableCards.reduce(
                    // accumulate credit limits from selected cards only
                    (accumulator, card) => accumulator + (selectedCards.includes(app.util.hash(card.name)) ? card.credit : 0),
                    0
                )
                // re-render total credit and available cards
                app.render.totalCredit(app.state.totalCredit)
                app.render.availableCards(app.state.availableCards, app.state.selectedCards)
            },
            back: (e) => {
                // reset app state
                app.state.selectedCards = []
                // hide results, show form
                document.getElementById('form').classList.remove('hidden')
                document.getElementById('results').classList.add('hidden')
            }
        },
        render: {
            availableCards: (cards, selectedCards) => {
                const container = document.getElementById('available')
                const newList = document.createDocumentFragment()
                cards.forEach(card => {
                    const element = document.createElement('li')
                    const isSelected = selectedCards.includes(app.util.hash(card.name))
                    let action = 'Select'
                    if (isSelected) {
                        action = 'Remove'
                        element.classList.add('selected')
                    }
                    element.classList.add('card')
                    element.innerHTML = `
                        <h3 class='card-name'>${card.name}</h3>
                        <div class='card-image' title='${card.name} image'></div>
                        <div class='card-info'>
                            <div>${card.apr}% APR</div>
                            <div>${card.btDuration ? card.btDuration + ' months' : 'No'}  BT offer</div>
                            <div>${card.purchaseDuration ? card.purchaseDuration + ' months' : 'No' } Purchase offer</div>
                            <div>&pound;${card.credit} credit limit</div>
                        </div>
                        <button data-id='${app.util.hash(card.name)}' onclick='app.handlers.toggleSelectCard(event)'>${action}</button>
                    `
                    newList.append(element)
                })
                container.innerHTML = ''
                container.append(newList)
            },
            totalCredit: (totalCredit) => {
                document.getElementById('credit').innerHTML = `Total credit provided by selected cards: &pound;${totalCredit}`
            }
        }
    }

    // expose app as global in window
    if (typeof window !== 'undefined') {
        window.app = app
    }

    // export app as module
    if( typeof exports !== 'undefined' ) {
        if( typeof module !== 'undefined' && module.exports ) {
            exports = module.exports = app
        }
        exports.app = app
    }
})()