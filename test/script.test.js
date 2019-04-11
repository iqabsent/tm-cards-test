const app = require('../src/script')

describe('app', () => {
    test('.. exists as object', () => {
        expect(typeof app).toBe('object')
    })
    test('.. has sane default state', () => {
        expect(app.state.availableCards.constructor).toBe(Array)
        expect(app.state.availableCards.length).toBe(0)
        expect(app.state.selectedCards.constructor).toBe(Array)
        expect(app.state.selectedCards.length).toBe(0)
        expect(app.state.totalCredit).toBe(0)
    })       
    test('.. exposes handler functions', () => {
        expect(typeof app.handlers.formSubmit).toBe('function')
        expect(typeof app.handlers.toggleSelect).toBe('function')
    })
    test('.. exposes render functions', () => {
        expect(typeof app.render.totalCredit).toBe('function')
        expect(typeof app.render.availableCards).toBe('function')
    })
})

describe('app.util', () => {
    describe('.requirementEvaluators', () => {
        describe('.occupationIs()', () => {
            const occupationIs = app.util.requirementEvaluators.occupationIs;
            const applicantData = {}
            const requirement = {}
            test('.. returns boolean', () => {
                expect(typeof occupationIs(applicantData, requirement)).toBe('boolean')
            })
            test('.. true when applicantData.occupation meets requirement.value', () => {
                applicantData.occupation = 'dev'
                requirement.value = 'dev'
                expect(occupationIs(applicantData, requirement)).toBe(true)
            })
            test('.. false when applicantData.occupation does not meet requirement.value', () => {
                applicantData.occupation = 'dev'
                requirement.value = 'senior dev'
                expect(occupationIs(applicantData, requirement)).toBe(false)
            })
        })
        describe('.minIncome()', () => {
            const minIncome = app.util.requirementEvaluators.minIncome;
            const applicantData = {}
            const requirement = {}
            test('.. returns boolean', () => {
                expect(typeof minIncome(applicantData, requirement)).toBe('boolean')
            })
            test('.. true when applicantData.income meets requirement.value', () => {
                applicantData.income = 15000
                requirement.value = 15000
                expect(minIncome(applicantData, requirement)).toBe(true)
            })
            test('.. false when applicantData.income does not meet requirement.value', () => {
                applicantData.income = 14000
                requirement.value = 15000
                expect(minIncome(applicantData, requirement)).toBe(false)
            })
        })
    })
    describe('.checkRequirements()', () => {
        const checkRequirements = app.util.checkRequirements
        const card = {
            name: 'Test Card',
            requirements: [
                { type: 'minIncome', value: 5000 },
                { type: 'occupationIs', value: 'dog' }
            ]
        }
        let applicantData = {
            income: 4000,
            occupation: 'cat'
        }
        test('.. returns boolean', () => {
            expect(typeof checkRequirements(card, applicantData)).toBe('boolean')
        })
        test('.. returns false if all requirements are unmet', () => {
            expect(checkRequirements(card, applicantData)).toBe(false)
        })
        test('.. returns false if any requirements are unmet', () => {
            applicantData.income = 5000
            expect(checkRequirements(card, applicantData)).toBe(false)
        })
        test('.. returns true if all requirements are met', () => {
            applicantData.occupation = 'dog'
            expect(checkRequirements(card, applicantData)).toBe(true)
        })
        test('.. returns false if any requirement is unrecognised', () => {
            card.requirements.push({ type: 'random', value: 'irrelevant' })
            expect(checkRequirements(card, applicantData)).toBe(false)
        })
        test('.. requirements are open to extension', () => {
            app.util.requirementEvaluators.random =
                (applicantData, requirement) =>
                    requirement.value.replace('vant', applicantData.occupation) === 'irreledog'
        })
    })
    describe('.hash()', () => {
        const hash = app.util.hash;
        test('.. returns undefined with no input', () => {
            expect(typeof hash()).toBe('undefined')
        })
        test('.. returns a string if a string is passed', () => {
            expect(typeof hash('')).toBe('string')
        })
        test('.. replaces spaces with dashes', () => {
            expect(hash('this is-a test')).toBe('this-is-a-test')
        })
        test('.. replaces uppercase with lowercase', () => {
            expect(hash('ThisIsAnotherTest')).toBe('thisisanothertest')
        })
        test('.. replaces URI unsafe characters with URI-encoded ones', () => {
            expect(hash('thisis£')).toBe('thisis%C2%A3')
        })
    })
})