import { ICommand, CommandExecutor } from '../src/command';

describe('CommandExecutor', () => {

    describe('exec', () => {

        test('should execute a simple command', () => {
            // arrange
            const test = new TestCommand()
            const executor = new CommandExecutor(test)

            // act
            const actual = executor.exec('test')

            // assert
            expect(actual).toBe(true)
            expect(test.run).toBeCalled()
        })

        test('should return false if command does not exist', () => {
            // arrange
            const executor = new CommandExecutor()

            // act
            const actual = executor.exec('test')

            // assert
            expect(actual).toBe(false)
        })

        test('should pass the extra parameters to the command', () => {
            // arrange
            const test = new TestCommand()
            const executor = new CommandExecutor(test)

            // act
            const actual = executor.exec('test', '123')

            // assert
            expect(actual).toBe(true)
            expect(test.run).toBeCalledWith('123')
        })

        test('should return false if no parameter passed', () => {
            // arrange
            const test = new TestCommand()
            const executor = new CommandExecutor(test)

            // act
            const actual = executor.exec()

            // assert
            expect(actual).toBe(false)
        })

    })

})

class TestCommand implements ICommand {
    name = 'test'
    run = jest.fn()
}