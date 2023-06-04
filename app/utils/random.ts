
import normal from "@stdlib/random/base/normal";
import poisson from "@stdlib/random/base/poisson";
import uniform from "@stdlib/random/base/uniform";
import pareto from "@stdlib/random/base/pareto-type1";
import binomial from "@stdlib/random/base/binomial";
import exponential from "@stdlib/random/base/exponential";


export function getDistributionRNG(distribution: string, options: any): () => number {
    let func = () => 0;


    // If something doesn't seem like it's working, make sure to break!
    switch (distribution) {
        case 'normal':
            func = normal.factory(options.mean, options.std)
            break

        case 'poisson':
            func = poisson.factory(options.lambda)
            break

        case 'uniform':
            func = uniform.factory(options.min, options.max)
            break

        case 'pareto':
            func = pareto.factory(options.alpha, options.beta)
            break

        case 'binomial':
            func = binomial.factory(options.n, options.p)
            break
        
        case 'exponential':
            func = exponential.factory(options.lambda)
            break
        
        default:
            func = () => 0;
            break
    }

    const wrappedFunc = () => {
        let value = Math.round(func());
        if (value < 0) {
            value = 0;
        }
        return value;
    };

    return wrappedFunc
}