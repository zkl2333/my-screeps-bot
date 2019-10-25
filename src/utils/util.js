const util = {
    ClosestTarget: function(self, Targets) {
        let closestI = 0
        if (Targets.length > 1) {
            let tarr = []
            for (let i = 0; i < Targets.length; i++) {
                // let distance = Math.sqrt(
                //     Math.abs(
                //         Math.pow(Targets[i].pos.x - Targets[i].pos.y, 2)
                //     ) +
                //     Math.abs(
                //         Math.pow(self.pos.x - self.pos.y, 2)
                //     )
                // )

                tarr[i] = self.pos.findPathTo(Targets[i]).length
            }
            closestI = tarr.indexOf(Math.min(...tarr))
            // if (self.memory.building) {
            //     // console.log(closestI,tarr[closestI],...tarr)
            // }
        }
        return Targets[closestI]
    }
}

module.exports = util
