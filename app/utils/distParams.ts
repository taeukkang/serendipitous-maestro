export type DistParamSetting = {
    paramSymbol: string,
    paramName: string,
    paramKey: string
}

const normalDistParams: DistParamSetting[] = [
    {
        paramSymbol: 'µ',
        paramName: 'Mean',
        paramKey: 'mean'
    },
    {
        paramSymbol: 'σ',
        paramName: 'Std',
        paramKey: 'std'
    }
]

const uniformDistParams: DistParamSetting[] = [
    {
        paramSymbol: 'min',
        paramName: 'Min',
        paramKey: 'min'
    },
    {
        paramSymbol: 'max',
        paramName: 'Max',
        paramKey: 'max'
    }
]

const exponentialDistParams: DistParamSetting[] = [
    {
        paramSymbol: 'λ',
        paramName: 'Rate',
        paramKey: 'lambda'
    }
]

const poissonDistParams: DistParamSetting[] = [
    {
        paramSymbol: 'λ',
        paramName: 'Rate',
        paramKey: 'lambda'
    }
]

const binomialDistParams: DistParamSetting[] = [
    {
        paramSymbol: 'n',
        paramName: 'Trials',
        paramKey: 'n'
    },
    {
        paramSymbol: 'p',
        paramName: 'Prob.',
        paramKey: 'p'
    }
]

const paretoDistParams: DistParamSetting[] = [
    {
        paramSymbol: 'α',
        paramName: 'Shape',
        paramKey: 'alpha'
    },
    {
        paramSymbol: 'β',
        paramName: 'Scale',
        paramKey: 'beta'
    }
]

export const distParams = {
    normal: normalDistParams,
    uniform: uniformDistParams,
    exponential: exponentialDistParams,
    poisson: poissonDistParams,
    binomial: binomialDistParams,
    pareto: paretoDistParams
}