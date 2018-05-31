jest.mock('fs');
const fs = require('fs');

import { DefaultRepository, Package } from "../src/repository";

describe('Package Class', () => {

    describe('getDescriptor', () => {

        test('should return package descriptor', async () => {
            // arrange
            const path = '/packages/alpha';
            const expected = {
                name: 'alpha',
                version: '1.0.0'
            };
            fs.__writeJson(`${path}/package.json`, expected);

            const pkg = new Package(path);

            // act
            const actual = await pkg.getDescriptor();

            // assert
            expect(actual).toEqual(expected);
        });

        test('should reject when package descriptor does not exist', () => {
            // arrange
            const path = '/packages/alpha';
            const pkg = new Package(path);

            // act
            const promise = pkg.getDescriptor();

            // assert
            expect(promise).rejects.toThrow(`File does not exist. (${path}/package.json)`);
        });

    });

});

describe('DefaultRepository Class', () => {

    describe('allPackages', () => {

        test('should return all packages', async () => {
            // arrange
            fs.__mkdir('/pkg/alpha');
            fs.__mkdir('/pkg/beta');
            fs.__writeFile('/pkg/foo.json');
            fs.__writeFile('/pkg.json');

            const repository = new DefaultRepository('/', { packagesDir: 'pkg' });

            // act
            const packages = await repository.allPackages();

            // assert
            expect(packages).toEqual([
                { path: '/pkg/alpha' },
                { path: '/pkg/beta' }
            ]);
        });

        test('should ignore directories without package descriptor', () => {
            // arrange
            const repository = new DefaultRepository('/');

            // act
            const promise = repository.allPackages();

            // assert
            expect(promise).rejects.toThrow('Directory does not exist.');
        });

    });

});

afterEach(() => {
    fs.__clear();
});