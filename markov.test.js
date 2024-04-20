const { MarkovMachine } = require("./markov")

describe("Markov tests", () => { 

    test("Validate return is a string", () => {
        let mm = new MarkovMachine("The cat in the hat is super cool")
        let res = mm.makeText()
        expect(res).toEqual(expect.any(String))
    })

    test("Validate mapping", () => {
        let mm = new MarkovMachine("one two three two four")

        let compare = new Map([
            ["one", ["two"]],
            ["two", ["three","four"]],
            ["three",["two"]],
            ["four",[null]]
        ])
        expect(mm.chain).toEqual(compare)
    })
})