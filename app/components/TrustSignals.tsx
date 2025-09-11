import { Lock, Shield } from 'lucide-react'
import React from 'react'

const TrustSignals = () => {
    return (
        <div className="flex items-center justify-center space-x-4 pt-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
                <Shield className="w-3 h-3" />
                <span>Secure</span>
            </div>
            <div className="flex items-center space-x-1">
                <Lock className="w-3 h-3" />
                <span>Encrypted</span>
            </div>
        </div>
    )
}

export default TrustSignals