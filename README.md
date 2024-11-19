# advent-of-code-node

## How to use

-   Create a class that implements `InterfaceSolutionStrategy` organized inside the `src/Solution/Strategy` directory.
    -   These are organized by year and day
-   Create a mocha test file adjacent to it, with the same name as the file you created, but with `.spec.ts` extension
    -   So if your file was named `34.ts`, name your spec file `34.spec.ts`
-   Write your unit tests
-   Run `mocha` and use the `-f` filter to run only your test (by name)
    -   Example: `node_modules/mocha/bin/mocha.js  -f 'Solution 20151'`

## TODO

-   20161b
    -   Current direction: North
    -   Last known point 0,0
    -   Data structure: lines
        -   [{from: {EastWest 0, NorthSouth: 0}, to: {EastWest 3, NorthSouth: 0}}, {from: {EastWest 3, NorthSouth: 0}, to: {EastWest 3, NorthSouth: -4}}]
    -   On input
        -   Create a new line item
        -   Add last known point to both from and to
        -   Calculate new direction (rotate)
        -   Determine new axis we will be moving along (axes)
        -   Determine whether we will be moving negative or positive (factor)
        -   Starting with last known poi1nt, apply the change (addition - could be adding negative) to the correct axis of the `from` in new line segment
        -   Loop through other all prior added line segments, calculating whether they intersect with new line segment
            -   How to calculate intersection
                -   Calculate 4 orientations
                    -   A: priorFrom, priorTo, newFrom
                    -   B: priorFrom, priorTo, newTo
                    -   C: newFrom, newTo, priorFrom
                    -   D: newFrom, newTo, priorTo
                        ```
                        def orientation(p, q, r):
                            val = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1])
                            if val == 0:
                                return 0  # Collinear
                            return 1 if val > 0 else 2  # Clockwise or Counterclockwise
                        ```
                -   IF A !== B && C !== D
                    -   They intersect!
                -   ELSE
                    -   For same mutations, if orientation was 0 AND the "outsider" point (from other segment - 2 of points will belong to same segment, 1 point will not) is between the 2 points from the same segment, then they DO intersect - so return true
                    -   Otherwise, they don't intersect
            -   For all points of intersection, stash them in an array
            -   Of those items, find the one that is closest to the `from` of our new line (that will be the first intersection)
                -   abs(x1 - x2) + abs(y1 - y2)
        -   IF we found an intersection
            -   SUM up the difference between original location X (0) and intersection X (?) + difference between original location Y (0) and intersection Y (?)
                -   That will be the number of blocks
        -   ELSE
            -   Append the new line segment to list of line segments
            -   Update last known point
