import { expect } from 'chai';
import {
    BuildingConcrete,
    FloorMapConcrete,
    getStarterSolutionData,
    ItemConcrete,
    ItemSetConcrete,
    SolutionPath,
    SolutionPathConcreteFactoryConcrete,
} from './common.js';
describe('201611a', () => {
    describe('SolutionPath', () => {
        it('solves', () => {
            /*
                F4 .  .  .  .  .
                F3 .  .  .  LG .
                F2 .  HG .  .  .
                F1 E  .  HM .  LM
            */
            const solutionPathConcreteFactoryConcrete =
                new SolutionPathConcreteFactoryConcrete();
            const floors = new FloorMapConcrete();
            const building = new BuildingConcrete(floors, 1);
            floors.set(
                1,
                new ItemSetConcrete([
                    new ItemConcrete('H', 'microchip'),
                    new ItemConcrete('L', 'microchip'),
                ])
            );
            floors.set(
                2,
                new ItemSetConcrete([new ItemConcrete('H', 'generator')])
            );
            floors.set(
                3,
                new ItemSetConcrete([new ItemConcrete('L', 'generator')])
            );
            const solutionPathConcrete =
                solutionPathConcreteFactoryConcrete.getInstance(building);
            const solution = getStarterSolutionData();
            solutionPathConcrete.solve([], solution);
            expect(solution.minKnownSolutionPath).to.eql('');
        });
    });
});
