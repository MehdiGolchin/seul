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

    });

});

describe('DefaultRepository Class', () => {

    describe('allPackages', () => {

        test('should return all packages', async () => {
            // arrange
            fs.__mkdir('/packages/alpha');
            fs.__mkdir('/packages/beta');
            fs.__writeFile('/packages/foo.json');
            fs.__writeFile('/packages.json');

            const repository = new DefaultRepository('/');

            // act
            const packages = await repository.allPackages();

            // assert
            expect(packages).toEqual([
                { path: '/packages/alpha' },
                { path: '/packages/beta' }
            ]);
        });

    });

});

afterEach(() => {
    fs.__clear();
});