const cards = [
    {
        name: "Student Life",
        apr: 18.9,
        btDuration: 0,
        purchaseDuration: 6,
        credit: 1200,
        requirements: {
            occupationIs: "student"
        }
    },
    {
        name: "Anywhere Card",
        apr: 33.9,
        bt_duration: 0,
        p_duration: 0,
        credit: 300,
        requirements: {}
    },
    {
        name: "Liquid Card",
        apr: 33.9,
        bt_duration: 12,
        p_duration: 6,
        credit: 3000,
        requirements: {
            minIncome: 16000
        }
    }
]

function requirementsMet(card, applicantData) {
    return true; // TODO, actual filtering
}

function handleFormSubmit(e) {
    e.preventDefault()
    const formData = {
        // just what we care about .. for now
        income: document.querySelector('[name=income]').value,
        occupation: document.querySelector('[name=occupation]:checked').value
    }

    console.log('FORM DATA: ', formData)
}