export const formatAddress = (address: string | null): string => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
  export const formatBalance = (balance: string | null): string => {
    if (!balance) return '0';
    const ethBalance = parseInt(balance) / 1e18;
    return ethBalance.toFixed(4);
  };