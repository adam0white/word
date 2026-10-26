EXTERNAL remaining()
EXTERNAL flag(key)

-> opening

=== opening ===
Your uncle Nuri died last week. His shop is shut. Four people have come to decide whether it opens again.
He promised Halil morning repair work. He promised Rıza space for a delivery cart on the same floor. Both heard him clearly. Neither can speak for him now.
Ferda will take a new lease only if the work can pay. Osman owns the room. He leaves in twenty-four minutes to meet another tenant.
Nuri left a letter at the depot. Fetching it takes six minutes. Ferda says it concerns a clothing order, not who owns anything.
You have ₺100 set aside for your journey home. You can spend it to make an agreement work.
* [Put the notebook on the table.]
  @start
  -> END

=== table ===
Agree on work hours, cart storage and rent. Everyone must sign the same terms.
* [Hear what someone needs.]
  @hear
  -> END
* {not flag("letter")} [Fetch Nuri's letter. Lose six minutes.]
  @letter
  -> END
* [Write a proposal.]
  @offer
  -> END
* {not flag("caught")} [Speak to someone in private.]
  @private
  -> END
* [Let Osman leave. End the meeting.]
  @leave
  -> END

=== hear ===
Each conversation takes three minutes. A refusal tells you what must change.
* {not flag("halil")} [Ask Halil about the work.]
  @ask_halil
  -> END
* {not flag("riza")} [Ask Rıza about the cart.]
  @ask_riza
  -> END
* {not flag("osman")} [Ask Osman about rent.]
  @ask_osman
  -> END
* {not flag("ferda")} [Ask Ferda about opening.]
  @ask_ferda
  -> END
* [Return to the table.]
  @back
  -> END

=== offer ===
These are future arrangements between the people here. Nuri's words cannot make anyone accept them.
{flag("caught"):After your conflicting statements, they also require a ₺40 deposit paid today.}
* [Morning work. Rent an outside cart space. You cover ₺100.]
  @morning
  -> END
* {flag("letter")} [Late work after the cart leaves. Use the clothing order. You cover ₺40.]
  @late
  -> END
* {not flag("letter")} [Suggest late work without the letter.]
  @late_unproved
  -> END
* [Morning work with the cart inside. You pay nothing.]
  @shared
  -> END
* [Return to the table.]
  @back
  -> END

=== private ===
Halil and Rıza will compare your words before they sign. A cheap agreement based on two different accounts may fall apart there.
* {not flag("told_halil")} [Tell Halil: “The floor is reserved for morning work. Everyone agreed.” This is false.]
  @tell_halil
  -> END
* {not flag("told_riza")} [Tell Rıza: “The floor is not reserved for morning work. Everyone agreed.” This is false.]
  @tell_riza
  -> END
* {flag("told_halil") || flag("told_riza")} [Withdraw my private assurances in front of everyone. Pay a ₺40 deposit on any agreement.]
  @disclose
  -> END
* [Return to the table.]
  @back
  -> END

=== signing ===
The terms stay on the table. A new proposal cancels every signature.
* [Ask the next person to sign. Takes one minute.]
  @sign
  -> END
* [Change the proposal. Clear every signature.]
  @offer
  -> END
* [End the meeting without agreement.]
  @leave
  -> END

=== ending ===
One month later.
* [Close the notebook.]
  @close
  -> END
