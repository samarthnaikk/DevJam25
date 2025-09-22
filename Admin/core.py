"""
This file intends to have all the core functions required for the communications 
within the same network.
"""

import socket

def GetIP():
    """
    Return the machine's primary local IPv4 address as a string.
    """
    #UDP
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            # connect to a public IP; no packets are actually sent for UDP connect
            s.connect(("8.8.8.8", 80))
            ip = s.getsockname()[0]
            if ip and not ip.startswith("127."):
                return ip
    except Exception:
        pass

    #Hostname and non-loopback IPv4
    try:
        hostname = socket.gethostname()
        infos = socket.getaddrinfo(hostname, None, family=socket.AF_INET)
        seen = set()
        for info in infos:
            addr = info[4][0]
            if addr not in seen:
                seen.add(addr)
                if not addr.startswith("127."):
                    return addr
    except Exception:
        pass

    #gethostbyname
    try:
        ip = socket.gethostbyname(socket.gethostname())
        if ip and not ip.startswith("127."):
            return ip
    except Exception:
        pass

    #non-loopback - getaddrinfo
    try:
        infos = socket.getaddrinfo(None, None, family=socket.AF_INET)
        for info in infos:
            addr = info[4][0]
            if addr and not addr.startswith("127."):
                return addr
    except Exception:
        pass

    # If we reached here, nothing found. Either return loopback or raise.
    # Raising makes caller explicitly handle failure.
    raise RuntimeError("Could not determine local IPv4 address (all attempts failed).")